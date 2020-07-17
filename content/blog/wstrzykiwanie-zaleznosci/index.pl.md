---
title: Jak zyskać swobodę dzięki wstrzykiwaniu zależności?
date: 2020-07-17
author: Michał Paczków
description:
image:
imageCredit:
categories:
tags:
---

Będąc na praktykach w ramach studiów programowałem używając C# (ASP.net) i Javascript'u. Nie miałem doświadczenia z testami, czy pisaniem kod, w taki sposób, żeby dało się go potem utrzymać. Wtedy pierwszy raz uslyszałem o wstrzykiwaniu zależności. "Hmm, jakie kontenery DI? Po co takie komplikacje? Przecież wszystko działa." - pomyślałem.

Wszystko zmieniło się kiedy kolega pokazał mi kod. Wyjaśnił jak dzięki wstrzykiwaniu możemy ułatwić sobie zarządzanie zależnościami. Wtedy stwierdziłem, że jest to bardzo przydatna rzecz i...cholernie skomplikowana, zarezerwowana tylko dla programowania obiektowego, klas i interfejsów.

Dziś jednak opowiemy sobie o wstrzykiwaniu zależności na frontendzie. Czym jest wstrzykiwanie zależności, co dzięki temu możemy zyskać i jak to zaimplementować.

## Co trenerzy piłkarscy wiedzą o problemach z zależnościami

Zanim przejdziemy do świata programowania, przykład zależności dotyczącej piłki nożnej.

Wyobraźmy sobie trenera Brzęczka który ustala skład na Euro ~~2020~~ 2021. Drużyna musi składać się z:

- bramkarza
- obronców
- pomocników
- napastników

Są to **ogólne** pozycje, na które trener musi wystawić **konkretnych** piłkarzy. Nie ma u nas problemu z bramkarzem, w zależności od sytuacji może wstawić Szczęsnego czy Fabiańskiego. **Nie jest uzależniony od jednego, konkretnego wyboru**.

Inaczej w ataku, tam jedno miejsce jest zarezerwowane dla konkretnego piłkarza - Lewandowskiego - od którego nasza reprezentacja **jest uzależniona**.

Kiedy to będzie problem? W momencie w którym zakończy on karierę lub dostanie kontuzji. Jest go bardzo trudno zastąpić, bo spoczywa na nim **dużo odpowiedzialności**.

Podsumowując, w momencie budowania struktury, nie powinno uzależnianić się jej od konkretnych obiektów. Warto budować ją opierające się o pewne ogólne elementy, które potem można skonkretyzować. Ważne, żeby mieć możliwość ich dopasowania i podmiany w zależności od potrzeb i sytuacji.

<!-- TODO: zdjecie reprezentacji -->

Jak przenieść to na świat programowania? Tworzyć zależności, bez opierania się o konkretne obiekty. A pomoże nam w tym wstrzykiwanie zależności.

## Wstrzykiwanie zależnosci

Jeśli czytałeś [moj poprzedni post](https://miscoded.io/pl/blog/odwrocenie-sterowania/) dotyczący odwrócenia sterownia. Wiesz, że wstrzykiwanie zależności jest jej najpopularniejszą implementacją. W ramach przypomnienia, kiedy chcemy zastosować odwrócenie sterowania, warto zadać sobie dwa pytania:

- Jak wygląda domyślny proces i co można odwrócić?
- Jakie korzyści przyniesie odwrócenie procesu?

Czym jest domyślny proces jeśli chodzi o tworzenie zależności? Polega on na tym, że klasa definiuje jakie konkretne typy potrzebuje. Dzięki temu łatwo jest odzwierciedlić, świat realny w naszym programie...tak przynajmniej uczono mnie na studiach. Rozważmy kod zajmujący się budową samochódu.

W poniższym przykładzie specjalnie operuje na prototypach. Dzięki temu możesz zobaczyć, że odwrócenie zależności nie jest zarezerowane tylko do programowania obiektowego, klas i interfejsów.

Widzimy tutaj zdefiniowanie obiektu `Car` i jego utworzenie. Klasa ta sama określa jakie zależności potrzebuje.

```javascript
function Car() {
  this.engine = new Engine(); // only one, concrete object
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

Odwrócić sterowanie! Jeśli domyślnym procesem było zdeifniowanie konkretnych typów przez klasę, odwracamy to i dostarczamy klasie potrzebne zależności z zewnątrz:

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

// highlight-next-line
const car = new Car(new Engine(128)); // we build dependency here - outside Car class
const fastCar = new Car(new Engine(256));
```

Co dzięki temu zyskaliśmy? Swobodę. W typ przykładzie to tworzenie różnych rodzajów samchodów. Nie jesteśmy już uzależnieni od jednego typu silnika.

<!-- TODO: Add Image with clubs -->

## Wstrzykiwanie zależności i testy - dobrana para

Bardzo często o wstrzykiwaniu zależności mówi się przy okazji testów. To właśnie dzięki swobodzie jaką zyskujemy wprowadzając zasady odwrócenia sterowania, możemy testować komponenty naszej aplikacji izolując je od innych.

Praktyczny przykład to funkcjonalność wykorzystująca zewnętrzne API. W ramach testów nie chcemy odpytwać zewnętrznego API:

- prowadzi to do dodatkowych kosztów związanych z odpytaniem np. używając API w którym płaci się za każdy request
- wydłuża czas testowani
- uzależnia test od API. Jeśli serwer wystawiający API ulegnie awarii test nie przjedzieX

### Mockowanie API

Rozważmy przykład w którym chcemy przesłać to wartswy prezentacji, listę użytkowników.

```javascript
function UserService() {
  function getUser() {
    return new Promise(
     function(resolve){
      setTimeout(() => resolve([{ name: "Joe"}]), 1000)
    })
    );
  }

  return { getUser };
}

function View() {
  this.userService = UserService();
  this.listElements = [];

  function render(rootElement) {
    this.userService.getUser().then(users => {
      this.listElements = `<li>${user.name}</li>`;
    });
  }
}
```

## Wstrzykiwanie zaleznosci w Javascript [300 slow + kod]

Podac kilka roznych sposobow na wstrzykiwanie zaleznosci

## Podsumowanie [200 slow]
