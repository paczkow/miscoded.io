---
title: Subtelne powtórzenia i jak je zwalczać (1/2). Polimorfizm
date: 2020-08-21
author: Michał Paczków
publish: true
description: Czym są subtelne powtórzenia oraz jak wykorzystać polimorfizm, żeby się ich pozbyć i sprawić by nasz kod był łatwy do utrzymania
image: assets/cover.jpg
imageCredit: "Zdjęcie: [Cyril Saulnier](https://unsplash.com/@c_reel)"
categories:
  - Javascript
  - Wzorce projektowe
tags:
  - refactoring
---

Powtórzenia, zmora każdego programisty. Pamiętam jak na początku mojej drogi, pracowałem z kodem legacy. Miałem wrażenie, że programiści, którzy go stworzyli, kochali skróty "CTRL+C", "CTRL+V". Dodawanie nowej funkcjonalności czy modyfikacja była koszmarem. Należało wprowadzić te same zmiany w X miejsach tracąc przy tym mnóstwo czasu, nerwów i energii.

Jednak takie doświadczenia mają rówież swoje plusy. Nauczyłem się wtedy jak istotna jest dbałość o jakość kodu, w tym unikanie powtórzeń na rzecz odpowiednich abstrakcji.

## Subtelne powtórzenia

Najbardziej oczywistą formą powtórzeń jest występowanie fragmentów identycznego kodu w kilku miejsach.

Jednak istnieją bardziej subtelne formy powtórzeń. W książce "Czysty kod" autorstwa Uncle Bob'a, wymienione są:

- łańcuchy instrukcji `switch-case` lub `if-else`, które występują wielokrotnie w różnych miejscach w kodzie, zawsze z tym samym zbiorem warunków
- moduły, które mają podobne algorytmy, ale nie mają podobnego kodu - inaczej mówiąc moduł zawiera pewną listę kroków, jednak w zależności od typu implementacja kroków jest inna

Dziś zajmiemy się pierwszym z wymienionych.

## Powtórzenia, a instrukcje warunkowe

Dla pokazania omawianego problemu zaimplementujemy sobie proces przygotowania kawy. Mmmm w końcu kto nie kocha kawy?

Na potrzeby tego postu uprościłem proces, który składa się z:

- przygotowania wody (zagotowanie do odpowiedniej temperatury)
- dodania odpowiedniej ilości cukru
- dodania mleka

Oczywiście każdy z wymienionych kroków będzie różnił się w zależności o typu kawy. W końcu do espresso nie potrzebujemy mleka, ale do cappuccino już tak.

Rozwiązanie tego problemu składa się z dwóch klas:

- `CoffeMaker` odpowiedzialna za poszczególne kroki związane z przygotowaniem napoju
- `Barista` odpowiedzialna za przygotowanie kawy i dobranie odpowiedniego naczynia

```javascript
export class CoffeeMaker {
  makeCoffee(type) {
    this.prepareWater(type);
    this.prepareSugar(type);
    this.prepareMilk(type);

    return type;
  }

  prepareWater(type) {
    // #1
    // highlight-start
    switch (type) {
      case "espresso":
        console.log(`brew water for ${type}`);
        break;
      default:
        console.log(`heat water to 70 degrees for ${type}`);
    }
    // highlight-end
  }

  prepreSugar(type) {
    // #2
    // highlight-start
    if (type === "espresso") {
      console.log(`don't add suggar for ${type}`);
    } else if (type === "cappuccino") {
      console.log(`add sugar for ${type}`);
    }
    // highlight-end
  }

  prepareMilk(type) {
    // #3
    // highlight-start
    if (type === "espresso") {
      console.log(`don't suggar for ${type}`);
    } else if (type === "cappuccino") {
      console.log(`add sugar for ${type}`);
    }
    // highlight-end
  }
}

export class Barrista {
  constructor(coffeeMaker) {
    this.coffeeMaker = coffeeMaker;
  }

  prepareCoffee(type) {
    const cup = this.prepareCupForCoffee(type);
    const coffee = this.coffeeMaker.makeCoffee(type);

    console.log(`${coffee} in ${cup} is ready!`);
  }

  prepareCupForCoffee(type) {
    // #4
    // highlight-start
    switch (type) {
      case "espresso":
        return "espresso cup";
      default:
        return "cup";
    }
    // highlight-end
  }
}
```

W powyższym kodzie widzimy instrukcje warunkowe `if-else` oraz `switch-case`. W każdej z nich mamy ten sam zestaw warunków. Opierają się one o typ kawy. W tym przykładzie to _espresso_ i _cappuccino_.

Implementacja rozwiązuje postawiony problem, jednak takie rozwiązanie będzie problematyczne w utrzymaniu.

Wyobraź sobie, że chcesz dodać kolejny typ kawy. **Oznacza to zmianę we wszystkich instrukcjch warunkowych powiązanych z typem kawy.** Tutaj są to tylko 4 miejsca, ale w skomplikowanej aplikacji byłoby ich zdecydowanie więcej. Do tego dochodzi wiele typów kawy...i mamy wspomniany koszmar. Pytanie jak to zrobić lepiej?

Zmniejszyć liczbę miejsc które trzeba edytować. W tym celu powinniśmy zastąpić każdą powtarzającą się instrukcję warunkową odpowiednią funkcją, która wykonałaby konkretny krok.

Funkcje te byłby częścią obiektu, który w czasie wykonywania programu podmienialibyśmy na odpowiedni rodzaj kawy. Dzięki temu funkcje "wiedziałby" co należy zrobić np. czy dodać mleka (_cappuccino_) czy nie (_espresso_).

Pytanie jak możemy stworzyć obiekt, który tak łatwo da się podmienić? Wykorzystać polimorfizm!

## Polimorfizm

Zacznijmy od genezy samego słowa polimorfizm, a właścwie _polymorphism_. Pochodzi ono ze starożytnej Grecji, a składa się z _poly (wiele) + morph (form) + ism_ - "wiele form". Taka też jest jego definicja:

> Termin polimorfizm oznacza "wiele form" (postaci) jednego bytu

Jednak czym jest to "wiele form"? Gdzie możemy to zaobserwować?

Odpowiedzmy sobie na to pytanie opierając się o kawę.

Jest to napój o pewnych ogólnych cechach. Dla uproszczenia będą nimi:

- zawartość kofeiny
- konieczność zaparzenia (przykład z kodu)
- możliwość wypicia

Jednak kawa może mieć _różne formy_ cappuccino, latte, espresso, americano. Mimo różnić w smaku, aromacie każdą z nich nazwiemy kawą, bo każda posiada wcześniej wymienione ogólne cechy kawy.

Kiedy komuś powiesz, żeby zrobił Ci kawę (bez podania konkretnego rodzaju) możesz otrzymać cappuccino czy latte. **"Kawa" zostanie podmieniona na konkretny typ** w zależności od sytuacji np. możliwości ekspresu.

Ten przykład obrazuje polimorfizm. Mamy jeden byt (kawę), która może wystąpić pod wieloma różnymi postaciami.

![Różne postacie, ale wciąż ten sam byt - kawa](assets/coffees.jpg)

Jednak jak to ma się do programowania? Polimorfizm jest jednym z fundamentów programowania obiektowego i oznaczna możliwość zaprojektowania ogólnego interfejsu (kawa) dla grupy pewnych powiązanych obiektów (latte, espresso, cappuciono).

Do komunikacji z innymi elementami systemu wykorzystujemy właśnie ten ogólny interfejs. Zawiera on zbiór wspólnych funkcji dla grupy obiektów, w naszym przypadku jest to np. `prepareWater`. Inne części systemu wywołują tylko te funkcje, a wszystkie szczegóły zamykamy w powiązanych obiektach np. `Cappucino`.

**Chcemy, aby inne części posiadały jak najmniej szczegółów, dzięki temu zmniejszamy liczbę miejsc w których trzeba będzie modyfikować kod**.

Interfejs ten jest następnie podmieniany na konkretną implementację (klasę) w czasie działania programu, dzięki temu wywoływana jest odpowiednia funkcja w zależności od typu.

> Należy pamiętać, że Javascript nie jest w pełni obiektowym językiem, nie występują tu interfejsy, a klasy to tak naprawdę syntactic sugar - ukłon w stronę programowania obiektowego. "Pod maską" kryje się wykorzystanie prototypów. Więcej dowiesz się [tutaj](https://medium.com/siliconwat/how-javascript-classes-work-80b0cf483b1d)

## Polimorfizm, a powtórzenia

Mając już wiedzę na temat polimformizmu, przeprowadzimy refaktoryzację kodu. Zacznijmy od zdefiniowania naszego interfejsu - ogólnej klasy `Coffee`. Będzie ona zawierać metody służące do komunikacji z innymi elementami systemu.

```javascript
class Coffee {
  getType() {
    return null;
  }

  prepareWater() {}

  prepareSugar() {}

  prepareMilk() {}

  prepareCupForCoffee() {}
}
```

Klasa `Coffee` zawiera metody potrzebne do wykonania każdego z kroków potrzebnych do przygotowania kawy. Nie posiada ona jednak żadnych szczegołów związanych z implementacją. Zostaną one przeniesione do bardziej szczegółowych klas - typów kawy.

```javascript
export class Espresso extends Coffee {
  getType() {
    return "espresso";
  }

  prepareWater() {
    console.log(`brew water for ${this.getType()}`);
  }

  prepareSugar() {
    console.log(`don't add suggar for ${this.getType()}`);
  }

  prepareMilk() {
    console.log(`don't suggar for ${this.getType()}`);
  }

  prepareCupForCoffee() {
    return "cup";
  }
}

export class Cappucino extends Coffee {
  getType() {
    return "cappucino";
  }

  prepareWater() {
    console.log(`heat water to 70 degrees for ${this.getType()}`);
  }

  prepareSugar() {
    console.log(`add sugar for ${this.getType()}`);
  }

  prepareMilk() {
    console.log(`add suggar for ${this.getType()}`);
  }

  prepareCupForCoffee() {
    return "small cup";
  }
}
```

W powyższym kodzie widzimy inną implementację metod w zależności od typu kawy. Dzięki temu będziemy mogli usunąć powtarzające się instrukcje warunkowe w innych częściach aplikacji.

```javascript
/* coffee.js */
export class CoffeeMaker {
  makeCoffee(coffee) {
    coffee.prepareWater();
    coffee.prepareSugar();
    coffee.prepareMilk();

    return coffee.getType();
  }
}

export class Barrista {
  constructor(coffeeMaker) {
    this.coffeeMaker = coffeeMaker;
  }

  prepareCoffee(coffee) {
    const preapredCoffee = this.coffeeMaker.makeCoffee(coffee);
    const glass = coffee.prepareGlassForCoffee(coffee);

    console.log(`${preapredCoffee} in ${glass} is ready!`);
  }
}
```

Spójrzmy na zmodyfikowaną klasy `CoffeeMaker` i `Barrista`. Nie występują tu już szczegóły związane z konkretnym typem kawy. Dzięki temu kod znaczenie się uprościł, a powtórzenia zostały usunięte.

[Tutaj omawiany przykład.](https://codesandbox.io/s/coffee-32inm)

https://codesandbox.io/s/coffee-32inm

## Podusmowanie

Powtórzenia to nie tylko fragementy identycznego kodu. Często kryją się pod instrukacjami `if-else` i `switch-case` rozsianymi po całej aplikacji. Jeśli zawuażysz, występowanie takich instrukcji z indetycznymi warunkami to prawodobnie kod można poprawić, usuwając instrukcje warunkowe. Nie bój się wtedy wykorzystać polimorfizmu, skomplikowanie brzmi tylko z nazwy.
