---
title: Asynchroniczność w Javascript, jak uniknąć piekła?
date: 2020-10-29
author: Michał Paczków
publish: true
description: Asynchroniczność to jeden z trudniejszych zagadnień w programowaniu. Mimo wysokiego progu wejścia jest ona wszechobecna i należy ją znać. Jednak czym ona właściwie jest? Jak ją dobrze zaimplementować w Javascript?
image: assets/cover.jpg
imageCredit: "Zdjęcie: [raquel raclette](https://unsplash.com/@raquelraclette)"
categories:
  - Javascript
  - Asynchroniczność
tags:
  - refactoring
  - react
---

Asynchroniczność to koncept niełatwy do zrozumienia i jeszcze trudniejszy do dobrego zaimplementowania. Mimo tych trudności asynchroniczność jest dziś wszechobecna i trzeba ją znać.

Napisana w poprawny sposób jest w stanie podnieść wydajność naszej aplikacji, jednak to obosieczny miecz. Asynchroniczne rozwiązania mogą doprowadzić do trudnych do znalezienia błędów, w tym związanych z...obniżeniem wydajności. Coż za ironia!

Jednak czym asynchroniczność właściwie jest?

## Nie pozwól procesorowi czekać

Wróćmy do podstaw związanych z przetwarzaniem naszego kodu. Zajmuje się tym procesor, który (bez zagłębiania się w szczegóły) wykonuje nasz program krok po kroku, czy właściwie linijka po linijce. **Jest on bardzo szybki** i większość operacji takich jak iteracja w pętli czy dodanie dwóch liczb może być wykonana w całości przez procesor.

Jednak wiele programów współdziała z rzeczami poza procesorem, przykładami są:

- odczyt danych z dysku
- komunikacja przez sieć

Operacje te **są o wiele wolniejsze niż te, które wykonuje procesor i stratą czasu byłoby pozostawienie go oczekującego na zakończenie którejś z nich**. Lepiej pozwolić mu przejść do następnych kroków, a kiedy ta powolna operacja zakończy się, poinformować go o tym, żeby zajął się przetworzeniem jej rezultatu. Jak jednak doprowadzić do takiej sytuacji w naszym kodzie?

## Synchroniczność vs Asynchroniczność

W programowaniu wyróżniamy **model synchroniczny** w którym każdy z kroków wykonywany jest pojedynczo oraz **model asynchroniczny**, który umożliwia wykonywanie wielu operacji jednocześnie.

W przypadku powolnej operacji (takiej jak zapytanie do serwera) program w modelu asynchronicznym nie czeka na jej zakończenie, tylko wykonuje następne kroki. W momencie zakończenia tej operacji program jest o tym informowany i uzyskuje dostęp do jej wyniku (np. danych z serwera).

Najłatwiej zobaczyć różnicę pisząc prosty program, który pobierze dane z dwóch źródeł, a następnie je wyświetli. Założeniem jest, że dane są on siebie niezależne, więc można je pobrać równolegle.

Jeśli dobrze zaimplementujemy asynchroniczne rozwiązanie, **pozwoli nam szybciej pobrać dane niż rozwiązanie synchroniczne**, w którym najpierw zostaną pobrane dane z pierwszego źródła, a dopiero po zakończeniu tej operacji dane z drugiego.

![Porównanie czasu wykonania operacji w modely synchronicznym i asynchronicznym](assets/sync_vs_async.png)

## Asynchroniczności w Javascript

### Callbacks

W Javascript rozwiązania asynchroniczne były długo realizowane tylko za pomocą `callback'ów`, czyli zwykłych funkcji, które wywoływały się w momencie zakończenia określonej operacji. Prosty przykładem, może być `setTimeout`, który wywoła funkcje po upłynięciu określonego czasu.

```javascript
setTimeout(() => console.log("I'm calling after 1 second"), 1000);
```

W czasie kiedy strony ograniczały się do podstawowych interakcji z użytkownikiem, a o "aplikacjach internetowych" nikt nie słyszał, było to wystarczające.

Z czasem do przeglądarek przenoszono coraz więcej logiki, miało to odzwierciedlenie również w kodzie asynchronicznym i `callback'ach`.

`Callback'i` zaczęto w sobie zagnieżdzać co znaczenie pogarszało czytelność kodu oraz wydłużało czas potrzebny do jego zrozumienia i wprowadzenia zmian. Określono to jako `callback hell`.

Czy wobec tego jesteśmy w stanie stworzyć asynchroniczne rozwiązanie, które będzie czytelniejsze?

```javascript
// an example of callback hell
// source: http://callbackhell.com/
fs.readdir(source, function(err, files) {
  if (err) {
    console.log("Error finding files: " + err);
  } else {
    files.forEach(function(filename, fileIndex) {
      console.log(filename);
      gm(source + filename).size(function(err, values) {
        if (err) {
          console.log("Error identifying file size: " + err);
        } else {
          console.log(filename + " : " + values);
          aspect = values.width / values.height;
          widths.forEach(
            function(width, widthIndex) {
              height = Math.round(width / aspect);
              console.log(
                "resizing " + filename + "to " + height + "x" + height
              );
              this.resize(width, height).write(
                dest + "w" + width + "_" + filename,
                function(err) {
                  if (err) console.log("Error writing file: " + err);
                }
              );
            }.bind(this)
          );
        }
      });
    });
  }
});
```

### Promise

Pewnym ułatwieniem jeśli chodzi o asynchroniczność stał się obiekt `Promise`. Wyobraź sobie, że składasz obietnicę swojemu przyjacielowi. Kiedy skończysz pewne czasochłonne zadanie, natychmiast go o tym poinformujesz.

Dokładnie to jest `Promise` (tak, stąd nazwa). Reprezentuje on asynchroniczną operację, która zostanie wykonana w przyszłości. Kiedy operacja zakończy się, `Promise` poinformuje o tym nasz program.

Możemy do niego dołączyć funkcje, które zostaną wywołane w zależności od tego czy operacja zakończy się sukcesem, bądź porażką (np. błędem). Używamy do tego słowa kluczowego `then`.

```javascript
// after 1s Promise is resolved and calls the attached function
const promise = new Promise(resolve => setTimeout(() => resolve(1), 1000));
promise.then(data => console.log(data));
```

Obiekt `Promise`, a właściwie słowo kluczowe `then` umożliwia stworzenie łańcucha operacji, które zostaną wykonane jedna po drugiej. Nazywamy to `promises chaining`.

```javascript
getUserByName("Foo")
  .then(user => getPosts(user.id))
  .then(posts => getTopics(posts))
  .then(topics => console.log());
```

> Z technicznego punktu widzienia `then` opakowuje rezultat `callback'a` w `Promise`. Oznacza to, że łańcuchu można również wykorzystać funkcje nie zwracające obiektu `Promise`.

```javascript
const getNumbers = () => new Promise(resolve => resolve([1, 2, 3, 4]));

getNumbers() // is Promise object
  .then(numbers => numbers.filter(num => num % 2 === 0)) // this is just Array.prototype.filters
  .then(evenNumbers => console.log("Even numbers: ", evenNumber.join(" "))); // "Even numbers: 2 4"
```

Kod ten jest czytelniejszy wciąż jednak pozostaje mniej czytelne niż rozwiązanie synchroniczne, chociażby przez potrzebnę przesłania `callback'ów` do każdego z elementów łańcucha. Więcej o `Promise` dowiesz się [tutaj](https://javascript.info/promise-basics)

Czy w Javascript jest możliwość stworzenia asynchronicznego kodu, który będzie równie czytelny co kod synchroniczny? Sprawdźmy `async-await`!

### async-await

Dzięki parze słów kluczowych `async` `await` jesteśmy w stanie stworzyć kod asynchroniczny, który wygląda jak synchroniczny! Spójrzmy na poniższy przykład.

```javascript
async function getTopicsByUser(user) {
  const user = await getUserByName(user);
  const posts = await getPosts(user.id);
  const topics = await getTopics(posts);

  console.log("Topics is done");
}

getTopicsByUser("Foo");
console.log("Do next steps");
```

Funkcja `getTopicsByUser` jest asynchroniczna to znaczy, ze nie blokuje ona kolejnych kroków wykonywania programu.

> Należy pamiętać, że funkcja oznaczonej jako `async` zwraca obiekt `Promise`

Rezultatem powyższego kodu będzie wyświetelnie w konsoli:

```text
Do next steps
Topics is done
```

Jednak sam kod w funkcji **działa w synchroniczny sposób** co znacznie ułatwia jego analizę i poźniejsze utrzymanie.

W powyższym przykładzie widzimy użycie kilka słów `await`. Powoduje ono, wstrzymanie wykonywania dalszych kroków w funkcji, aż do momentu zwrócenia rezultatu operacji jaki jest po prawej stronie `await`.

W naszym przykładzie `getPosts` zostanie wywołane dopiero gdy funkcja `getUserByName` zwróci wynik.
Wygląda na to, że piekło związane z asynchronicznym kodem zostało pokonane raz na zawsze...czy na pewno?

### async-await hell - witamy ponownie w piekle

Założmy, że chcemy stworzyć komponent w `React` wyświetlający ulubione ksiażki użytkownika. API z którego korzystamy pozwala wykorzystać nam dwie metody:

- `getUsers` pobierająca użytkowników, każdy użytkownik posiada właściwość `favoriteBooks`, przechowujący id ulubionych książek
- `getBooks` pobranie listy książek

```javascript
export const getUsers = () =>
  new Promise(resolve =>
    setTimeout(
      () => resolve([{ id: 1, name: "Michał", favoriteBooks: [1] }]),
      250
    )
  );

export const getBooks = () =>
  new Promise(resolve => {
    setTimeout(
      () =>
        resolve([
          { id: 1, title: "Clean Code" },
          { id: 2, title: "Cracking the Coding Interview" },
        ]),
      500
    );
  });
```

Opierając się o przedstawione API, musimy:

- pobrać użytkownika
- pobrać listę książek
- odfiltrować książki, które nie należą do ulubionych
- wyświetlić resztę

W naszym przykładzie pobranie użytkownika trwa `250ms`, a książek `500ms`.

Stworzyłem komponent który, w momencie zamontowania pobiera użytkownika, ksiązki, filtruje je i wyświetla. Dodatkowo pokazuje łączny czas potrzebny do pobrania wszystkich zasobów.

```javascript
const FavoriteBooks = () => {
  const [state, setState] = useState(null);

  const getData = async () => {
    const start = performance.now();

    const users = await getUsers();
    const books = await getBooks();

    const end = performance.now();

    setState({
      user: users[0],
      books: users[0].favoriteBooks.map((bookId) =>
        books.find((book) => book.id === bookId)
      )
    });

    console.log(end - start); // 750 ms
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    // render list of book
  )
};
```

Program działa, jednak niepokojąca wygląda czas wykonania wszystkich operacji - `750ms`. Skoro pobranie uzytkowników trwa `250ms`, a książek `500ms` oznacza to, ze nasze rozwiazanie nie działa synchronicznie, a przynajmniej nie działa tak jak tego oczekujemy. Witamy ponownie w piekle.

### Jak pokonać async-await hell

Jak wspomniałem na początku książki oraz użytkowników mogą zostać **pobrane równoległe**. Jednak stosując `async-await` wymusiłem pobranie książek dopiero po pobraniu użytkownika. Co za marnotrawstwo! Nazywa się to `async-await hell` i często prowadzi do obniżenia wydajności naszych rozwiązań. Jak tego uniknąć?

Podstawą jest przeanalizowanie **które z zasobów, mogą zostać pobrane niezależnie od innych**. Jeśli już to zrobimy, należy te dane odpowiednio zsynchronizować. Pytanie jak to zrobić?

W tym celu możemy wykorzystać `Promise.all`. Funkcja ta przyjmuje kolekcję `Promise`, które zostaną wykonane równolegle. Wynik zwracany jest w momencie w którym każda z przesłanych `Promise` wykona się i zwróci wynik. Poprawy nasz kod używając `Promise.all` i sprawdźmy wynik.

```javascript
const FavoriteBooks = () => {
  const [state, setState] = useState(null);

  const getData = async () => {
    const start = performance.now();

    // highlight-next-line
    const [users, books] = await Promise.all([getUsers(), getBooks()]);

    const end = performance.now();
    console.log(end - start); // 500 ms

    setState({
      user: users[0],
      books: users[0].favoriteBooks.map((bookId) =>
        books.find((book) => book.id === bookId)
      )
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
     // render list of book
  )
};

```

Widzimy, że tym razem czas wykonania wszystkich operacji to około `500ms`. Oznacza to, że pobranie zasobów jest wykonywane równolegle. W końcu możemy poczuć ulgę, mamy czytelny kod który nie spowalnia naszego rozwiąznia. Tutaj znajdziesz cały kod.

### Uważaj na promises chaining

Podobnie jak w przypadku `async-await`, niepoprawne wykorzystanie `promises chaining` może przyczynić się do obinżenia wydajności, poprzez synchroniczne pobranie zasobów, które powinny zostać pobrane równolegle.

## Podsumowanie

- programowanie w modelu asynchroniczny pozwala wykonywać kilka rzeczy jednocześnie, w przeciwieństwie do modelu synchronicznego, w którym możemy wykonać tylko jedną rzecz
- w Javascript asynchroniczność długo była realizowana przez `callback'i`, jednak ich zagnieżdzenie powoduje mało czytelny, trudny do zrozumienia kod - `callback hell`
- rozwiązaniem problemu `callback hell` mogą być `Promise` lub `async-await`
  - tworząc kod z ich użyciem nalezy dokładnie przeanalizować które zasoby można pobrać niezależnie i użyć np. `Promise.all` do równoległego pobrania. Unikniemy w ten sposób które spowolnienia nasze rozwiązań
