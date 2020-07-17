---
title: Jak zyskać swobodę dzięki odwróceniu zależności?
date: 2020-07-17
author: Michał Paczków
description:
image: assets/cover.jpg
imageCredit: "Zdjęcie: [Abyss](https://unsplash.com/@abyss_)"
categories:
  - Javascript
  - Wzorce Projektowe
tags:
  - react
  - inversion-of-control
---

Będąc na praktykach w ramach studiów programowałem używając C# (ASP.net) i Javascript'u. Nie miałem doświadczenia z testami, czy pisaniem kod, w taki sposób, żeby dało się go potem utrzymać. Wtedy pierwszy raz uslyszałem o wstrzykiwaniu zależności. "Hmm, jakie kontenery DI? Po co takie komplikacje? Przecież wszystko działa." - pomyślałem.

Wszystko zmieniło się kiedy kolega pokazał mi kod. Wyjaśnił jak dzięki wstrzykiwaniu możemy ułatwić sobie zarządzanie zależnościami. Wtedy stwierdziłem, że jest to bardzo przydatna rzecz i...cholernie skomplikowana, zarezerwowana tylko dla programowania obiektowego, klas i interfejsów.

Dziś jednak opowiemy sobie o wstrzykiwaniu zależności na frontendzie. Czym jest wstrzykiwanie zależności, co dzięki temu możemy zyskać i jak to zaimplementować.

## Sport i problemy z zależnościami

Zanim przejdziemy do świata programowania, sprobujmy znaleźć problemy z zależnościami w sporcie.

Wyobraźmy sobie trenera jakiekolwiek sportu drużynowego, który ustala skład na ważny turniej.

Piłka nozna jest u nas najpopularniejsza dyscypliną, także wyobraźmy sobie trenera Brzęczka przygotowującego się na Euro ~~2020~~ 2021. Jego drużyna musi składać się z:

- bramkarza
- obronców
- pomocników
- napastników

Są to **ogólne** pozycje, na które trener musi wybrać **konkretnych** piłkarzy.

Nie ma u nas problemu z bramkarzem, w zależności od sytuacji może wstawić Szczęsnego czy Fabiańskiego. **Nie jest uzależniony od jednego, konkretnego wyboru**.

Inaczej w ataku, tam jedno miejsce jest zarezerwowane dla konkretnego piłkarza - Lewandowskiego - od którego nasza reprezentacja **jest uzależniona**.

Kiedy to będzie problem? W momencie w którym zakończy on karierę lub dostanie kontuzji. Jest go bardzo trudno zastąpić, bo spoczywa na nim **dużo odpowiedzialności**.

Podsumowując, w momencie budowania struktury, nie powinno uzależnianić się jej od konkretnych obiektów. Ważne, żeby mieć możliwość ich dopasowania i podmiany w zależności od potrzeb i sytuacji.

<!-- TODO: zdjecie reprezentacji -->

Jak przenieść to w świat programowania?

## Wstrzykiwanie zależności

Jeśli czytałeś [moj poprzedni post](https://miscoded.io/pl/blog/odwrocenie-sterowania/) dotyczący zasady odwrócenia sterownia wiesz, że wstrzykiwanie zależności jest jej najpopularniejszą implementacją. W ramach przypomnienia, kiedy chcemy zastosować odwrócenie sterowania, warto zadać sobie dwa pytania:

- Jak wygląda domyślny proces i co można odwrócić?
- Jakie korzyści przyniesie odwrócenie procesu?

Czym jest domyślny proces jeśli chodzi o tworzenie zależności? Polega on na tym, że klasa definiuje jakie konkretne typy potrzebuje. Dzięki temu łatwo jest odzwierciedlić, świat realny w naszym programie...tak przynajmniej uczono mnie na studiach. Rozważmy kod zajmujący się budową samochódu.

W poniższym przykładzie specjalnie operuje na prototypach. Dzięki temu możesz zobaczyć, że odwrócenie zależności nie jest zarezerowane tylko do programowania obiektowego, klas i interfejsów.

Widzimy tutaj zdefiniowanie obiektu `Car` i jego utworzenie. Klasa ta sama określa jakie zależności potrzebuje.

```javascript
function Car() {
  this.engine = new Engine(); // concrete object - lost flexibility
}

Car.prototype.start = function() {
  if (this.engine) {
    this.engine.start();
  }
};

function Engine() {
  this.horsepower = 64;
}

Engine.prototype.start = function() {
  console.log("Engine with " + this.hp + " hp has been started...");
};

const car = new Car();
```

Co może spowodować problemy w tym kodzie? Uzależnienie samochodu od konkretnego rodzaju silnika. Przez to nie możemy zbudować samochodu z mocniejszym/słabszym silnikiem w zależności od potrzeb. Implemetacja ta mocno nas ogranicza. Jak lepiej podejść do tego rozwiązania?

Odwrócić sterowanie! Jeśli domyślnym procesem było zdefiniowanie konkretnej zależnosci w klasie, odwracamy to i dostarczamy klasie potrzebną zależność z zewnątrz:

```javascript
function Car(engine) {
   // highlight-next-line
  this.engine =  enigne; // general object, passed from outside

Car.prototype.start = function() {
  if (this.engine) {
    this.engine.start();
  }
};

function Engine(horsepower) {
  this.horsepower = horsepower;
}

Engine.prototype.start = function() {
  console.log("Engine with " + this.hp + " hp has been started...");
};

// we build dependency here - outside Car class
// highlight-next-line
const car = new Car(new Engine(128));
const fastCar = new Car(new Engine(256));
```

Co dzięki temu zyskaliśmy? Swobodę. W typ przykładzie to tworzenie samchodów z rożnymi rodzajami silników. Nie jesteśmy już uzależnieni od jednego, konkretnego typu.

<!-- TODO: Add Image with clubs -->

## Odwrócenie zależności i testy - dobrana para

Bardzo często o wstrzykiwaniu zależności mówi się przy okazji testów. To właśnie dzięki swobodzie jaką zyskujemy wprowadzając zasady odwrócenia sterowania, możemy testować komponenty naszej aplikacji izolując je od innych.

Praktyczny przykład to funkcjonalność wykorzystująca zewnętrzne API. W ramach testów nie chcemy odpytwać zewnętrznego API. Powody to:

- dodatkowe koszty związane z odpytaniem np. używając API w którym płaci się za każdy request
- wydłuzenie czasu testowania
- uzależnia test od API. Jeśli serwer wystawiający API ulegnie awarii test nie przjedzie, mimo poprawnego kodu z naszej strony

### Mockowanie API

Rozważmy przykład w którym chcemy pobrać listę użytkowników z zewnętrznego serwisu `UserService`, a następnie na podstawie pobranych użytkowników utworzyć elementy listy - tagi `li`.

Zaimplementujmy rozwiązanie bez wstrzykiwania zależności.

<!-- TODO: zmienić na klase -->

```javascript
/* view.js */
import { UserService } from "./user_service";

export function View() {
  // concrete service, we lost flexibility here
  this.userService = UserService();

  this.createUserList = async function() {
    const users = await this.userService.getUser();

    return users.map(user => {
      const li = document.createElement("li");
      li.innerHTML = user.name;

      return li;
    });
  };
}

/* main.js */
import { View } from "./views";

const list = document.getElementById("list");
const usersView = new View();

usersView.createUserList().then(domElement => {
  list.appendChild(domElement[0]);
});
```

Widzimy tutaj funkcję `View` która pobiera użytkowników z serwisu, a następnie na ich podstawie buduje elementy listy. W tym momencie implementacja realizuje swoje zadanie, ale występuje problem z brakiem elastyczności.

`View` jest zależne `UserService`. Co jeśli chcielibyśmy podmienić go w momencie działania programu, albo napisać testy?

```javascript
// view.test.js
import { View } from "./views";

describe("UserView", function() {
  test("render list of users as 'li' elements", async () => {
    const view = new View();

    // function uses external service
    const usersList = await view.createUserList();

    // what should be a value of length?
    // length depends on external UserService
    expect(usersList.length).toBe(1);
  });
});
```

W tym momencie mamy problem. Funkcja `View` jest zależna od zewnętrznego serwisu którego nie możemy kontrolować. Tym samym tracimy kontrolę nad testem i pewnością, że nasza funkcjonalność działa. Jak to rozwiązać?

Możemy stworzyć funkcję `View`, które w argumencie przekażemy serwis na którym ma operować. Dzięki temu zyskujemy elastyczność. Z łatwością możemy dodać mockowy serwis dla testów.

```javascript
// view.js
export function DIView(userService) { // highlight-line
  this.userService = userService; // highlight-line

  this.createUserList = async function() {
    const users = await this.userService.getUser();

    return users.map(user => {
      const li = document.createElement("li");
      li.innerHTML = user.name;

      return li;
    });
  };
}

// view.test.js
import { DIView } from "./views";

  test("render users list for DI View", async () => {
    const mockUsers = [{ name: "mock-user-1" }, { name: "mock-user-2" }];
    // highlight-start
    const MockUserService = {
      getUser: () =>
        new Promise(function(resolve) {
          resolve(mockUsers);
        })
    };
    // highlight-end

    // highlight-next-line
    const view = new DIView(MockUserService); // pass mocked dependency

    const usersList = await view.createUserList();

    // we are sure about the result. It doesn't depends on external service
    expect(usersList.length).toBe(mockUsers.length);
  });
});
```

## Wstrzykiwanie zależności w React

### Składnia JSX

Popularne rozwiązania implementują wstrzykiwanie zależności w różny sposób. React nie jest tu wyjątkiem. JSX zapewnia nam wstrzykiwanie zależności bez tworzenia dodatkowych kontenerów. 

Najprostrzym przykładem są react'owe propsy. Dzięki nim do komponentu możemy przesłać różne dane w tym...inne komponenty. Bardzo dobry przykładem może byc artykuł: [One simple trick to optimize React re-renders](https://kentcdodds.com/blog/optimize-react-re-renders).

To co dla nas jest istotne w kontekście wstrzykiwanie zależności do sposób przekazania konkretnej instancji komponentu `Logger` jak `prop`. Ponizej kod z tego artykułu. W linii 16 możemy zobaczyć wstrzyknięcie komponentu.

```jsx
function Logger(props) {
  console.log(`${props.label} rendered`);
  return null; // what is returned here is irrelevant...
}

function Counter(props) {
  const [count, setCount] = React.useState(0);
  const increment = () => setCount(c => c + 1);
  return (
    <div>
      <button onClick={increment}>The count is {count}</button>
      {props.logger}
    </div>
  );
}

ReactDOM.render(
  <Counter logger={<Logger label="counter" />} />, // highlight-line
  document.getElementById("root")
);
```
<!-- Dodac przykład z contextem testy i funkcjonalność -->



## Podsumowanie
