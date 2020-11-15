---
title: Czy naprawdę wiesz wszystko o iteracji? Protokoły iteracyjne
date: 2020-11-13
author: Michał Paczków
publish: true
description: Kolekcje to fundament, na którym programista tworzy swoje rozwiązania. Ich najpopularniejszą operacją jest iteracja. Pewnie używałeś jej wiele razy, ale czy wiesz o niej wszystko? Jesteś w stanie powiedzieć, dlaczego możemy użyć for..of dla tablic, a obiektów już nie? Czy wiesz jak sprawić by Twoje struktury danych można iterować jak tablice?
image: assets/cover.jpg
imageCredit: "Zdjęcie: [Tine Ivanič](https://unsplash.com/@tine999)"
categories:
  - Javascript
tags:
  - iterator
  - react
---

Kolekcje to fundament programowania i codzienność programistów. Nawet tak banalne zadania jak TODO listy opierają się o nie. Najpowszechniejszą operacją związaną z kolekcjami jest iteracja. Pewnie wykonywałeś już ją milion razy, ale czy wiesz o niej wszystko?

Zastanawiałeś się kiedyś, dlaczego możemy użyć `for...of` lub `spread` dla tablicy, a obiektu już nie? Czy wiesz, co powoduje rożnicę w "zachowaniu" tych struktur?

Przyjrzyjmy się wspomnianym przykładom:

```javascript
const array = [1, 2, 3];
const object = { 1: 1, 2: 2, 3: 3 };

for (const element of array) {
  console.log(element);
}

for (const element of object) {
  // TypeError: object is not iterable
  console.log(element);
}

console.log(...array); // 1,2,3
console.log(...object); // TypeError: object is not iterable (cannot read property Symbol(Symbol.iterator))
```

Kiedy na JS'owym obiekcie chcemy użyć operatora `spread` lub `for...of` widzimy błąd - `TypeError: object is not iterable`, ale co to właściwie oznacza? Czym jest to `iterable`?

## Protokoły iteracyjne (ang. iteration protocols)

Iterable to obiekt, który implementuje `iterable protocol`, czyli protokół iterowalny.

Jest jednym z dwóch protokołów iteracyjnych w Javascript. "Protokoły iteracyjne" - to może w pierwszym momencie brzmieć skomplikowanie, jednak w rzeczywistości jest bardzo proste.

Najpierw zacznijmy o definicji "protokołu" z Wikipedii: "W najbardziej ogólnym sensie: zestaw reguł umożliwiających porozumienie".

Czym jest to porozumienie w kontekście programowania?

Określają one **komunikację między dwiema strukturami danych**. Dla przykładu wprowadźmy `A` i `B`.

Struktura `A` implementuje protokół, innymi słowy **zna i przestrzega pewnych zasad**. Przykładową zasadą może być posiadanie funkcji o konkretnej nazwie.

Struktura `B` wykorzystuje `A`. Dzięki ściśle zdefiniowanym zasadom (protokołowi), **wie czego oczekiwać** o `A` np. jaką funkcje wywołać.

> Podobną rolę w językach obiektowych pełnią interfejsy. Wymuszają na klasach, które je implementują pewne zasady jak posiadanie funkcji czy pól o określonych nazwach. Dzięki temu inne klasy operujące na interefejsach dokładnie wiedzą jaki funkcji mogą użyć.

Jak już wspomniałem protokoły iteracyjne są to dwa:

- protokół iteratora
- protokół iteracyjny

### Protokół iteratora (ang. iterator protocol)

Definiuje on sposób tworzenia sekwencji wartości używając następujących reguł:

- struktura musi posiadać właściwość o nazwie `next`
- `next` jest _funkcją_ zwracającą obiekt `{ value, done }` gdzie:
  - _value_ - dowolna wartość Javascript, jest pomijana kiedy, `done === true`
  - _done_ - wartość logiczna, która wskazuje czy zostanie wygenerowana następna wartość (`false`) czy zakończono tworzenie sekwencji wartości (`true`)

Poniżej mamy przykład prostego iteratora. Zwraca on sekwencję wartości `0 1 2`. Dalej mamy funkcje, która przyjmuje iterator i wywołuje `console.log`.

```javascript
const iterator = {
  counter: 0,
  // the first rule: next property that is function
  next: function() {
    // the second rule: return { value: any, done: boolean}
    const { counter } = this;
    const iterationValue = counter > 3 ? { value: counter, done: false} : { value: undefined, done: true}
    counter++;
    return iterationValue
  },
};

const anotherIterator = {
  next: function() {
    // ...some logic here
    return isDone ? { value, done: false} : { value: undefined, done: true }
  }
}

const logIteratorElements(iterator) {
  const isDone = false;
  while(isDone) {
    const { value, done } = iterator.next();
    console.log(value);
    isDone = done;
  }
}

logIteratorElements(simpleIterator); // 0 1 2
logIteratorElements(anotherIterator); // it works too!
```

W powyższym przykładzie możemy zobaczyć zaletę zdefiniowania śćisłego zestawu reguł. Dzięki nim funkcja `logIteratorElements` dokładnie wie co musi wywołać `next()` i z jakich właściwości skorzystać.

Dla ułatwienia, o iteratorze możesz myśleć jak o **wskaźniku** dzięki któremu możemy przejść do następnego elementu.

Mając już wiedzę na temat protokołu iteratora, przejdźmy do bohatera dzisiejszego postu - protokołu iterowalnego.

### Protokoł iterowalny (ang. iterable protocol)

Jest to zestaw reguł, który umożliwia strukturze danych udostępnienie elementów innym obiektom. Dzięki temu `for...of` lub `spread` "wiedzą" jak wyciągnać każdy z elementów struktury, zupełnie tak jak w przypadku tablic.

Żeby obiekt był iterowalny musi:

- implementować właściwość o nazwie `[Symbol.iterator]`, która jest funkcją
- funkcja ta zwraca obiekt zgodny z **protokołem iteratora** - iterator

O `Symbol.iterator` możesz myśleć jak o unikalnej nazwie, dzięki której inne struktury wiedzą, że obiekt jest iterowalny. Jeśli chcesz dowiedzieć się więcej o ES6 symbol [tutaj](https://javascript.info/symbol) znajdziesz świetny artykuł.

Co do drugiego warunku, protokół iteratora już sobie omówiliśmy.

Podsumowując, obiekt iterowalny musi posiadać właściwość `[Symbol.iterator]`, która jest `funkcją`.
Zwraca ona obiekt, zawierający właściwość `next`, która też jest `funkcja`, a jej rezultatem jest obiekt o strukturze `{value, done}`.

```javascript
const iterable = {
  // property [Symbol.iterator] - a function returns an iterator
  [Symbol.iterator]: function() {
    return iterator;
  },
};

const iterator = {
  counter: 0,
  // next property - a function returns { value, done } object
  next: function() {
    const iterationValue =
      this.counter < 3
        ? { value: this.counter, done: false }
        : { value: undefined, done: true };
    this.counter++;
    return iterationValue;
  },
};
```

Już wiemy jak wygląda protokół iteracyjny, ale jak wykorzystuje go np. `for..of`?
Składają się na to dwie operacje:

1. instrukcja `for..of` wywołuje funkcje przypisaną do właściwości `Symbol.iterator` (1).
2. zwraca ona obiekt z funkcją `next`, która jest wykonywana aż do momentu, w którym funkcja zwróci obiekt z polem `done` równym `true` (2).

```javascript
// prettier-ignore
for (let element of iterable) {  // #1 - call once iterable[Symbol.iterator]()
  console.log(element); // #2 - call iterator.next(), until done === true
}

// equivalent of for..of
const iterator = [Symbol.iterator](); // #1
let isDone = false;

while (isDone) {
  const { value, done } = iterator.next(); // #2
  console.log(value);
}
```

Wiemy już jak działają protokoły iteracyjne w Javascript, jednak czy ta wiedza przyda nam się w codziennych problemach?

## Protokoły iteracyjne w praktyce - własne, iterowalne struktury

Założmy, że dostajesz zadanie w którym musisz wyświetlić listę pracowników każdego działu w firmie, oraz wszystkich osób w firmie.

Prosta iteracja i zadanie skończone, jednak jest pewien problem. Struktura dla każdego działu jest obiektem o budowie hierarchicznej, przykład:

```javascript
export const department = {
  name: "Director of Department",
  subordinates: [
    {
      name: "Manager - One",
    },
    {
      name: "Manager - Two",
      subordinates: [
        {
          name: "IT Worker",
        },
      ],
    },
  ],
};
```

Chcielibyśmy użyć operator `spread`, żeby połączyć pracowników ze wszystkich działów, oraz móc iterować po elementach obiektu `department`. Pytanie jak to zrobić?

Odpowiedzią jest: protokół iterowalny! Jeśli dodamy go do naszego obiektu, będziemy mogli wykorzystać wszystkie wspomniane funkcjonalności:

```javascript
export const department = {
  name: "Director of Department",
  subordinates: [
    // ... more nested items
  ],

  // highlight-start
  [Symbol.iterator]() {
    const { name, subordinates } = this;

    return {
      queue: [{ name }],
      next() {
        if (this.queue.length) {
          const { name, subordinates } = this.queue.shift();
          this.queue.push(...(subordinates ?? []));
          return { value: name, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  },
  // highlight-end
};
```

Nasz obiekt `department` rozszerzyliśmy o iterator, który zwróci sekwencję elementów zgodnie z tzw. przeszukiwanie wszersz (ang. Breadth-first search).

Dzięki temu w łatwy sposób będziemy mogli połączyć elementy z dwóch działów:

```jsx
export const department = {
  name: "Director of Department",
  subordinates: [
    // ... more nested items
  ],
  [Symbol.iterator]() {
    // ... iterator logic
  },
};

export const anotherDepartment = {
  // ... same logic as department object
};

const allEmpolyees = [...department, ...anotherDepartment]; // highlight-line
```

Stowrzyć funkcję `map`, którą wykorzystamy do wyświetlenia listy pracowników:

```jsx
export const department = {
  name: "Director of Department",
  subordinates: [
    // ... more nested items
  ],

  [Symbol.iterator]() {
    // ... iterator logic
  },
  // highlight-start
  map: function(fn) {
    const result = [];
    // we can just use for..of
    for (let employee of this) {
      result.push(fn(employee));
    }

    return result;
  },
  // highlight-end
};

/* React component */
const Employees = department => <ul>{department.map(employee => <li>{employee}</li>)}</ul>

// logic of another component
const Company {
  return <Employees department={department}>
}
```

[Tutaj](https://codesandbox.io/s/departments-hierarchy-9dimb) znajdziesz rozwinięcie powyższego przykładu z użyciem komponentu React'owego.

## Podsumowanie

- w Javascript występują dwa protokoły związane z iteracją:
  - protokół iteratora
  - protokół iterowalny
- protokołem nazywamy zbiór zasad, których musi przestrzegać struktura danych
  - wprowadzenie takiego zbioru ułatwia komunikację między strukturami. Obiekt, który używa struktur implementujących protokół wie jakich metod może użyć i jakiego zachowania oczekiwać
- protokół iteratora określa zasady potrzebne do wytworzenia sekwencji wartości. Możesz traktować go jak wskaźnik dzięki któremu wiadomo, czy i jaki będzie następny element w sekwencji
- protokół iterowalny określa zasady udostępnienia elementów struktury danych, dzięki temu operatory takie jak `for..of` czy `spread` mają dostęp do każdego elementu
- protokoły iteracyjnych możemy użyć do stworzenia własnych struktur, które będą iterowalne
