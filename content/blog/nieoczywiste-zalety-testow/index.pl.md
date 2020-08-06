---
title: (Nie)oczywiste zalety testów
date: 2020-07-24
author: Michał Paczków
publish: true
description: Pewność, że zmiany które dodaliśmy nie zepsuły aplikacji, a rozwiązanie działa zgodnie z założeniami. Dziś jednak zajmiemy się innymi zaletami testów - ich wpływem na kod produkcyjny i tworzenie dokumentacji.
image: assets/cover.jpg
imageCredit: "Zdjęcie: [Bill Oxford](https://unsplash.com/@bill_oxford)"
categories:
  - Javascript
  - Testowanie
tags:
  - react
  - jest
  - inversion-of-control
---

W czasie mojej programistycznej drogi kilkukrotnie prowadziłem rozmowy rekrutacyjne. Kiedy rozmowa schodziła na temat testów i ich zalet niemal zawsze pojawiały się podobne odpowiedzi:

- _"pewność, że wszystko działa"_
- _"pewność, że nic nie zepsułem"_
- _"pewność, że funkcjonalność jest zgoda z wymaganiami"_

W każdej z powyższych odpowiedzi przewija się jedno słowo - _pewność_ - jest to największa zaleta testów, zgadzam się w z tym w 100%.

Jednak czy jedyna? Bardzo rzadko mówi się o bezpośrednim wpływie testów na jakość kodu produkcyjnego czy tworzenie dokumentacji.

Testy dają nam dużą wartość na każdym etapie związanym z tworzeniem kodu. Takie etapy to:

- etap \#1 - _przed stworzeniem kodu_ - testy pozwalają lepiej zrozumieć problem i stworzyć bardziej dopasowane rozwiązanie
- etap \#2 - _w trakcie tworzenia kodu_ - testy wymuszają tworzenie elastycznych rozwiązań, często wykorzystując wzorce
- etap \#3 - _po stworzeniu kodu_ - dobrze opisane testy tworzą wysokiej jakości dokumentację

## Etap \#1 - Testy, a zrozumienie problemu

Gdy budowałeś rozwiązanie, zdarzyło Ci się pominąć jakiś ważny przypadek? A może miałeś sytuację, kiedy po stworzeniu rozwiązania okazało się, że odbiega ono od wymagań? Jak można sobie z tym poradzić? Wprowadzić testy.

Wprowadzenie testów sprawia, że należy dogłębniej przeanalizować problem, w celu napisania odpowiednich przypadków testowych. **Napisanie testów i określenie w nich wejścia oraz wyjścia, ułatwi Ci zrozumienie problemu i stworzenie bardziej dopracowanego rozwiązania.**

Weźmy za przykład prostą funkcję odpowiedzialną za obsługę płatności. Jeśli stan konta jest większy niż kwota płatność, transakcja jest zwierana i funkcja zwraca odpowiednią różnicę, w przeciwnym wypadku funkcja zwraca aktualny stan konta.

W poniższej implementacji mamy błąd? Widzisz go?

```javascript
const handlePayment = (balance, payment) =>
  !payment || balance - payment <= 0 ? balance : balance - payment;
```

Funkcja zwróci błędną wartość dla przypadku w którym stan konta jest równy kwocie płatności. Nie doprecyzowaliśmy warunku.

Wcześniejsze określenie takiego przypadku w teście pozwoliłoby doprecyzować funkcję i odpowiednio ją zaimplementować.

```javascript
// handle_payment.test.js
describe("handle payment function", () => {
  it("return 0, when payment equals balance", () => {
    expect(handlePayment(100, 100)).toEqual(0);
  });
});

// handle_payment.js
const handlePayment = (balance, payment) =>
  !payment || balance - payment < 0 ? balance : balance - payment;
```

Jeśli należy przetestować wiele różnych przypadków, które trudno zdefiniować np. możliwe wartości dla pola tekstowego i związaną z tym logikę, warto wykorzystać `Property Based Testing`.

W dużym skrócie polega to na generowaniu przypadków testowych, na podstawie zdefiniowanych przez programistę właściwości.

## Etap \#2 - Zastosowanie dobrych, reużywalnych rozwiązań

W [poprzednim poście](https://miscoded.io/pl/blog/wstrzykiwanie-zaleznosci/) powiedzieliśmy sobie, że wstrzykiwanie zależności i testy to dobrana para. Nie ma w tym przypadku. **Dobre, reużywalne abstrakcje łatwo się testuje.**

Jeśli chcesz zweryfikować elastyczność Twojego rozwiązania, sprawdź czy łatwo możesz skonfigurować je pod testy.

Popatrzmy na poniższy przykład. Jest to reactowy komponent wyświetalający listę użytkowników. Dodatkowo mamy możliwość filtrowania.

```jsx
import React, { useState, useEffect } from "react";
import { getUsers } from "./repos/Users";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const users = getUsers(filter);
    setUsers(users);
  }, [filter]);

  return (
    <>
      <input 
        data-testid="filter" 
        onChange={e => setFilter(e.target.value)} 
      />
      <ul data-testid="list">
        {users.map(user => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </>
  );
};
```

Doświadczeni programiści zauważą możliwość wydzielenia logiki do oddzielnej abstrakcji, ale nie uprzedzajmy faktów. Spróbujmy przetestować ten komponent.

```javascript
import React from "react";
import { render, screen, fireEvent, wait } from "@testing-library/react";
import { UsersList } from "./App";

describe("UsersList", () => {
  it("render elements of list, when component is mounted", () => {
    render(<UsersList />);
    const usersList = screen.getAllByTestId("list");

    // how should be the correct value?
    // we can test only by length - it's a low level of confidence
    // can we mock service in some way?
    expect(usersList.length).toEqual(1);
  });

  it("rerender element of list, when filter has changed", () => {
    render(<UsersList />);

    fireEvent.change(screen.getByTestId("filter"), {
      target: { value: "Foe" },
    });

    // too many responsibilities: filtering, getting data, rendering
    // can we split this?
    expect(screen.getByTestId("filter").value).toEqual("Foe");

    wait(() => {
      // how should be the correct value?
      // we check only by length - it's a low level of confidence
      expect(screen.getAllByTestId("list").length).toEqual(0);
    });
  });
});
```

Widzimy, że testowanie jest problematyczne. Nie możemy łatwo kontrolować użytkowników, co powoduje, że test daje nam niską pewność. Jednym z możliwoych rozwiązań jest zamockować cały import `getUsers`, jednak istnieje łatwiejsze rozwiązanie.

Dodatkowo testujemy różne odpowiedzialność w jednym komponencie, co wskazuję, że jest on za duży.

Jak można lepiej podejść do rozwiązania? Zacznijmy podziału odpowiedzialności w testach:

```javascript
describe("useUsers", () => {
  it("return list of users, when component is mounted", () => {});

  it("return new list of users, when filter has changed", () => {});
});

describe("List component", () => {
  it("render elements, when component is mounted", () => {});

  it("show message, when list is empty", () => {});
});
```

W powyższym kodzie przypadkie testowe zostały podzielone na:

- logikę związaną z użytkownikami, reprezentowaną przez reactowy hook `useUsers`
- komponent `List` odpowiedzialny, za wyrenderowanie przesłanych do niego elementów

Zaimplementujmy przypadki testowe:

```javascript
describe("useUsers", () => {
  it("returns list of users, when component is mounted", () => {
    const mockGetUsers = () => ["Joe", "Foe", "Foo"];

    const { result } = renderHook(() => useUsers(mockGetUsers));

    expect(result.current.users).toStrictEqual(mockGetUsers());
  });

  it("returns new list of users, when filter has changed", () => {
    const mockGetUsers = filter =>
      ["Joe", "Foe", "Foo"].filter(e => e.includes(filter));

    const { result } = renderHook(() => useUsers(mockGetUsers));

    act(() => {
      result.current.setFilter("Fo");
    });

    expect(result.current.users).toStrictEqual(mockGetUsers("Fo"));
  });
});

describe("List component", () => {
  it("render elements, when component is mounted", () => {
    const mockItems = ["Joe", "Foe"];
    render(<List items={mockItems} />);

    const elements = screen
      .getAllByTestId("list-element")
      .map(li => li.textContent);

    expect(elements).toEqual(mockItems);
  });

  it("show message, when list is empty", () => {
    render(<List items={[]} />);

    expect(screen.getByText(/List is empty/)).toBeTruthy();
  });
});
```

W testach dotyczących logiki związanej z użytkownikami mamy teraz możliwość kontroli danych (`mockGetUsers`) co zwiększa pewność testu. Jest to łatwiejsze rozwiązanie niż mockowanie importów.

Tak samo dla listy, dzięki wstrzyknięciu danych testowych łatwo możemy stwierdzić czy dane są odpowiednio wyrenderowane.

Na podstawie testów implementujemy komponenty:

```jsx
const useUsers = (query = getUsers) => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const users = query(filter);
    setUsers(users);
  }, [filter]);

  return { users, setFilter };
};

const List = ({ items }) => {
  return items && items.length ? (
    <ul>
      {items.map(item => (
        <li key={item} data-testid="list-element">
          {item}
        </li>
      ))}
    </ul>
  ) : (
    <p>List is empty</p>
  );
};
```

Podzielenie testów i zwiększenie ich pewności, wymusiło na nas rozdzielenie kodu produkcyjnego. Dzięki temu utworzyliśmy mniejsze, reużywalne komponent.

Teraz łatwo możemy połączyć listę z hook'iem `useUsers` do wyrenderowania listy użytkowników, ale równie łatwo stworzymy tabelę wyświetlającą użytkowników lub listę z danymi innymi niż użytkownicy.

Nasze rozwiązanie zyskało na elastyczności.

## Etap \#3 - Tworzenie dokumentacji

Oprócz wpływu na kod produkcyjny dobrze opisane testy są kolejną warstwą dokumentacji, często ulubioną warstwą programistów.

Zamiast suchej ściany tekstu, można przeczytać opis, a następnie uruchomić test. Programiści najszybciej uczą się poprzez kod i dzięki takiemu rodzajowi dokumentacji można zdecydowanie przyspieszyć zrozumienie działania testowanej funkcji, komponentu czy modułu.

Drugi z poniższych przykładów pochodzi z [Javascript testing best practices](https://github.com/goldbergyoni/javascript-testing-best-practices) do których przeczytania zachęcam.

```javascript
describe('the search function', () => {
  it('returns an array of strings that contain a given string', () => {
    [...insert test here...]
  }
  it('returns an empty array when there are no matches', () => {
    [...insert test here...]
  }
```

```javascript
//1. unit under test
describe("Products Service", function() {
  describe("Add new product", function() {
    //2. scenario and 3. expectation
    it("When no price is specified, then the product status is pending approval", () => {
      const newProduct = new ProductService().add( ... );
      expect(newProduct.status).toEqual("pendingApproval");
    });
  });
});
```

## Podsumowanie

Testy to potężne narzędzie poprawiające jakość kodu, dzięki któremu zaoszczędzimy sporo czasu. Testy dają pewność, że aplikacja działa zgodnie z wymaganiami, a wprowadzone zmiany nie zepsuły kodu. Jednak to nie jedyna zaleta testów.

Mają one bezpośredni wpływ na nasz kod produkcyjny. Wprowadzenie testów zmusza nas do głębszego zrozumienia abstrakcji którą chcemy stworzyć, oraz użycia wzorców projektowych zwiększających elastyczność naszych rozwiązań. Dodatkowo testy, są kolejną warstwą dokumentacji, zoszczedzając czytającemu sporo czasu na zrozumieniu mechanizmów działania Twojego kodu. Zdecydowanie warto je pisać!
