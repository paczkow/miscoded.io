---
title: (Nie)oczywiste zalety testów
date: 2020-07-24
author: Michał Paczków
publish: true
description: Pewność - główny atut testów. Pewność, że zmiany nic nie popsuły, a rozwiązanie działa zgodnie z założeniami. Dziś jednak zajmiemy się innymi zaletami testów - wpływem testów na kod produkcyjny i tworzenie lepszej dokumentacji.
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

Jednak czy jedyna? Bardzo rzadko wspominano o bezpośrednim wpływie testów na jakość kodu produkcyjnego czy tworzenie dokumentacji.

Testy pomagają nam na każdym etapie tworzenia rozwiązania:

- etap \#1 - przed - pozwalają lepiej zrozumieć problem i dobrać rozwiązanie
- etap \#2 - w trakcie - wymuszają tworzenie elastycznych rozwiązań, często wykorzystując wzorce
- etap \#3 - po - dobrze opisane testy tworzą wysokiej jakości dokumentację

## Etap \#1 - Testy, a zrozumienie problemu

Czy zdarzyło Ci się pominąć jakiś ważny przypadek, kiedy budowałeś swoje rozwiązanie? Może miałeś sytuację, kiedy po stworzeniu rozwiązania okazało się, że odbiega ono od wymagań? Jak można sobie z tym poradzić? Wprowadzić testy.

Wprowadzenie testów sprawi, że będziesz musiał dogłębniej przeanalizować problem, żeby napisać odpowiednie przypadki testowe. **Napisanie testów i doprecyzowanie w nich wejścia oraz wyjścia, ułatwi Ci zrozumienie problemu i stworzenie odpowiedniego rozwiązania.**

Weźmy za przykład prostą, przykładową funkcję odpowiedzialną za obsługę płatności. Jeśli stan konta jest większy niż płatność, transakcja jest zwierana i funkcja zwraca odpowiednią różnicę po transakcji. Jeśli nie funkcja zwraca aktualny stan konta.

W poniższej implementacji mamy błąd? Widzisz go?

```javascript
const handlePayment = (balance, payment) =>
  !payment || balance - payment <= 0 ? balance : balance - payment;
```

Funkcja zwróci błędną wartość dla przypadku w którym stan konta jest równy wartości płatności.

Wcześniejsze określenie takiego przypadku w teście pozwoliłoby doprecyzować funkcję i odpowiednio ją zaimplementować.

```javascript
// handle_payment.test.js
describe("handle payment function", () => {
  it("when payment equals balance, then return 0", () => {
    expect(handlePayment(100, 100)).toEqual(0);
  });
});

// handle_payment.js
const handlePayment = (balance, payment) =>
  !payment || balance - payment < 0 ? balance : balance - payment;
```

Jeśli występuję możliwość wielu przypadków granicznych (ang. Edge Cases) i trudno je wszystkie zdefiniować np. możliwe wartości dla pola tekstowego, warto wykorzystać `Property Based Testing`.

W dużym skrócie polega to na generowaniu przypadków testowych, na podstawie zdefiniowanych przez programistę właściwości.

## Etap \#2 - Zastosowania reużywalnych rozwiązań

W [poprzednim poście](https://miscoded.io/pl/blog/wstrzykiwanie-zaleznosci/) powiedzieliśmy sobie, że wstrzykiwanie zależności i testy to dobrana para. Nie ma w tym przypadku. **Dobre, reużywalne abstrakcje łatwo się testuje.**

Jeśli chcesz zweryfikować elastyczność Twojego rozwiązania, sprawdź czy łatwo możesz skonfigurować je pod testy.

Założmy, że tworzysz kontroler związany użytkownikami aplikacji - `UserController`. Którą z poniższych implementacji będzie łatwiej przetestować?

```javascript
// user_repo.js
class UserRepo {
  getUsers() {
    return Promise.resolve([{ name: "Joe" }]);
  }
}

// user_controller.js
export class UserController {
  constructor() {
    this.userRepo = new UserRepo();
  }

  async handleUsers(req, res) {
    const users = await this.userRepo.getUsers();
    return res.status(200).json({ users });
  }
}

export class UserControllerInjection {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async handleUsers(req, res) {
    const users = await this.userRepo.getUsers();
    return res.status(200).json({ users });
  }
}
```

Dzięki możliwości wstrzyknięcia serwisu poprzez konstruktor łatwiejsza do testowania jest druga z wymienionych klas. Mamy możliwość mockowania zależności w tej klasy i dzięki temu możemy stworzyć wiarygodne testy.

W przypadku klasy `UserController` wynik zależy od zewnętrznego serwisu, którego nie możemy kontrolować. Sprawia to, że nie jesteśmy w stanie solidnie przetestować tej funkcjonlaności.

```javascript
import { UserController, UserControllerInjection } from "./index";

describe("User Controller", () => {
  class MockUserRepo {
    getUsers() {
      return Promise.resolve([]);
    }
  }

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("return collection of users with status 200 - OK", async () => {
    const controller = new UserController();
    const response = mockResponse();

    // it's depend on external service - problem with controling values
    await controller.handleUsers(null, response);

    expect(response.status).toHaveBeenCalledWith(200);
    // we don't control this value, it depends on external service
    // good, reliable testing is not possible
    expect(response.json).toHaveBeenCalledWith({ users: [] }); // value ??
  });

  it("return collection of users with status 200 - OK", async () => {
    const controller = new UserControllerInjection(new MockUserRepo());
    const response = mockResponse();

    await controller.handleUsers(null, response);

    expect(response.status).toHaveBeenCalledWith(200);
    // we can control this value and whole test - easy testing
    expect(response.json).toHaveBeenCalledWith({ users: [] });
  });
});
```

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
