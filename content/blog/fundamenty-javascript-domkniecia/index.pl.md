---
title: Opanuj Fundamenty! Domknięcia
date: 2020-06-05
author: Michał Paczków
publish: true
image: assets/cover.jpg
imageCredit: "Zdjęcie: [Bence Balla-Schottner](https://unsplash.com/@ballaschottner)"
categories:
  - Javascript
  - Frontend
  - Backend
tags:
  - silnik-javascript
  - fundamenty-javascript
---

Witam Cię w czwartym artykule z serii "Opanuj Fundamenty". Opisuję w niej działanie mechanizmów języka Javascript. W ostatnim poście zajęliśmy się zakresami, dziś dowiesz się więcej o domknięciach. Czym są domknięcia? Jak język Javascript je realizuje? Jak można je wykorzystać w praktyce i w jaki sposób domknięć używają popularne rozwiązania takie jak React czy Redux?

## Domknięcia

Koncepcja domknięć (ang. Closures) w języku Javascript jest na tyle istotna, że przedstawię dwie różne definicje.

### Definicja pierwsza

Przed wprowadzeniem pierwszej definicji przypomnijmy sobie czym są zakresy i jak definiują one dostęp do zmiennych w Javascript.

```javascript
function outer() {
  var a = 10;

  function inner() {
    var b = 20;
    console.log(a + b); // access to a and b
  }

  inner();
}

console.log(a); // ReferenceError
```

W powyższym kodzie mamy 3 zakresy:

- globaly
- lokalny (funkcji outer)
- lokalny funkcji (inner)

Definiują one 2 operacje:

- dostęp do zmiennej z zakresu zewnętrznego (zmienna `a` w funkcji `inner`)
- błąd przy próbie uzyskania zmiennej z zakresu wewnętrznego (zmienna `a` w przypadku zakresu globalnego)

Dostęp do zmiennych zdefiniowany jest poprzez ich fizyczne położenie. Możemy uzyskać dostęp do zmiennych tylko z zakresów zewnętrznych.

Pytanie co jeśli funkcja zwróci inną funkcję, która w swoim ciele wykorzystuje zmienne z zewnętrznego zakresu? Przykład takiego kodu:

```javascript
function outer() {
  var a = 10;

  function inner() {
    var b = 20;
    console.log(a + b); // access to a and b
  }

  return inner;
}

var foo = outer();
foo(); // 30
```

Zmienna `foo` to referencja do funkcji `inner`. W swoim zakresie lokalnym zawiera ona zmienną `b` dzięki temu może jej użyć w `console.log`. Pytanie co z drugą zmienna i dlaczego nie otrzymaliśmy błędu? W koncu zmienna `a` nie znajduje w zakresie funkcji `inner`, oraz nie jest dostępna z zakresu globalnego, czyli z miejsca w którym wywołaliśmy funkcję poprzez zmienną `foo`. Dodatkowo po zakończeniu funkcji `outer` zmienna `a` powinna zostać wyszczyszczona. Odpowiedzią na to są domknięcia.

Domknięciem nazywamy możliwość funkcji polegającą na "zapamiętaniu" wszystkich zmiennych dostępnych w ramach zakresu w którym ta funkcja jest utworzona i ich poźniejszym wykorzystaniu nawet jeśli wywoływana jest ona w zakresie zewnętrznym.

W powyższym kodzie funkcja `inner` została stworzona w zakresie funkcji `outer`. W ramach tego zakresu ma ona dostęp do zmiennej `a`. Dzięki temu, może tę zmienną zapamiętać i użyć jej kiedy zostanie wywołana poza zakresem funkcji `outer` tak jak w przykładzie w zakresie globalnym.

//TODO: image with scope

Co ważne, żeby zaobserwować domknięcie należy wywołać funkcję w innym zakresie niż w tym w którym została zdefiniowana.
Taka jest też jej formalna definicja która mówi, że domknięcie występuje tylko w przypadku gdy funkcje wywołujemy w innym zakresie niż w tym w którym została utworzona.

## Definicja druga, mniej formalna

Funkcje w Javascript są wartościami pierwszego rzędu, dzięki temu mamy możliwość ich przesyłania jako argumenty, bądź zwracania jako wartość innej funkcji. Domknięcie w tym wypadku jest powiązaniem między funkcją, a wszystkimi zmiennymi do których miała dostęp w momencie utworzenia, niezależnie gdzie ta funkcja jest przesyłana, bądź zwracana.

// TODO: code + image

## Referencja, nie wartość

Warto wiedzieć, że funkcja w ramach domknięcia zapamiętuje referencje do zmiennych, a nie tylko ich wartość. Oznacza to, że wartości tych zmiennych mogą być edytowane.

// TODO: code

## Zapamiętanie zmiennych

Zapamiętanie zmiennych ma miejsce przy każdym utworzeniu funkcji. Przykładem może być kod pokazany poniżej. Widzimy jak każde wywołanie funkcji `adder` tworzy własne śródowisko z zapamiętanymi zmiennymi.

```javascript
function adder(num1) {
  return function addTo(num2) {
    return num1 + num2;
  };
}

var add10To = adder(10); // num1 = 10
var add5To = adder(5); // num1 = 5
```

## Gdzie przechowywana jest informacja o domknięciu

## Zastosowanie praktyczne

- wzorzec module
- domkniecia, a petle
- domkniecia w react
- domkniecia w redux

## Klasyka, czyli domknięcie i pętla

## Podsumowanie
