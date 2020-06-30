---
title: Jak pisać lepszy kod i poprawić komunikację z innymi? Wzorce projektowe
date: 2020-06-10
author: Michał Paczków
publish: true
description: Czy wiesz, co decyduje o dostępności zmiennej w Javascript? Co łączy LISP z Javascript'em? W trzeciej części serii "Opanuj Fundamenty!" odpowiemy sobie na te pytania, omawiając zakres.
image: assets/cover.jpeg
imageCredit: "Zdjęcie: [Samuel Scrimshaw](https://unsplash.com/@samscrim)"
categories:
  - Javascript
  - Wzorce projektowe
tags:
  - react
---

Poniedziałek. Szary i ponury. To ten z poniedziałków które najchętniej przeleżałbyś w łóżku. W drodze do pracy zaskoczył sie deszcz. Okazuje się, że ekspres do kawy nie działa. Zastanawiasz się czy może być gorzej. Wtedy dostajesz nowe zadanie: musisz dodać nowy formularz w jednym z pierwszych widoków aplikacji. Nogi uginają się pod Tobą, na skroni pojawia się pot, już wiesz że ten dzień będzie gorszy. Wielokrotnie słyszałeś o tej części projektu. Ten kod...każdy mówi o nim z przerażeniem. Wielu programistów już prosiło o jego przepisanie, niestety nie ma czasu i budżetu. Moduł jest zbyt duży. Każdy kto pracował z tym kodem jest już dawno poza firmą, nie wytrzymali tego...teraz czas na Ciebie.

W tej nieco podkolorowanej historii znajdziemy prawdę o dwóch rzeczach, zmianach i konieczności utrzymania czystego kodu. Te rzeczy muszą być ze sobą powiązane. W innym przypadku Ty i Twój zespół będzie bohaterami powyższej historii. Zgaduje, że tego nie chcecie.

Nieustannie aktualizujemy nasz kod. Dodajemy nowe funkcjonalności, usuwamy zbędne rzeczy. Pytanie co zrobić, żeby produkować wysokiej jakości kod z którym inni będą chcieli pracować? Każdy dobry programista posiada zestaw narzędzi pozwalających na tworzenie takiego kodu, a jednym z elementów są wzorce projektowe.

## Wzorce projektowe, czyli co?

Implementujesz rozwiązanie pewnego problemu. Okazuje się ono tak dobre, że koledzy z pracy zaczynają go używać do podobnych problemów. Wreszcie Twój pomysł wychodzi poza firmę. Jest tak świetny, że staje się szablonem, którego używają programiści na całym świecie. Takie rozwiązanie nazwiemy wzorcem projektowym.

Dodajmy bardziej sformalizowany opis: _wzorzec projektowy jest ogólnym rozwiązaniem często występującego problemu w projektowaniu oprogramowania. Nie jest gotowym projektem lecz szablonem, który można przekształcić bezpośrednio w kod._

Dlaczego nie możemy uznać go za gotowe rozwiązanie? Bo programiści rozwiązują problemy w różnych środowiskach, choćby świat Frontendu i Backendu, stąd rozwiązania nigdy nie będą się pokrywały w 100%.

// o książce

## Jeden wzorzec, różne implementacje

W ramach przykładu posłużmy się wzorcem dekorator. Omówimy jego definicję, po czym przejdziemy do przykładów użycia. Będą dotyczyć one języka Python i popularnej frontendowej biblioteki React. Zdecydowałem się na takie rozwiązanie, żeby pokazać jak w różny sposób można zaimplementować ten wzorzec.

### Dekorator

Jest to wzorzec strukturalny pozwalający na rozszerzenie obiektu o nowe funkcjonalności, bez wprowadzania zmian w jego kodzie. Polega na umieszczeniu rozszerzanego obiektu w specjalnych "opakowaniach" zawierających te funkcjonalności. Zaletami tego wzorca są:

- podzielenie logiki na warstwy
- dyanmicznie dodanie lub usunięcia funkcjonalności w czasie działania programu
- dodanie kilku zachowań do jednego obiektu poprzez użycie wielu dekoratorów

### Logowanie wywołań

Założmy, że masz zadanie, które polega na logowaniu wywołań funkcji. Funkcje mają mieć dodawaną tą funkcjonalności dynamicznie, podczas wykonywnia kod (run-time). Jak podszedłbyś to takiego problemu?

Jest rozwiązanie! A nazywa się ono dekorator. Poniżej znajduje ten wzorzec zaimplementowany w Pythonie. Miej na uwadze, że implementacja jest napisana w najprostrzy wręcz prymitywny sposób. Przedstawiam tu tylko koncepcję bez dodatkowych złożności. Dzieli się on na:

- funkcje `say_hello` której zadaniem jest wypisanie `"Hello!"` w konsoli. Została ona otoczona dekoratorem `@my_decorator`
- dekorator `my_decorator` przyjmuje funkcję jako parametr i zwraca ją wraz z dodatkową funkcjonalnością. W tym przypadku wypisanie informacji przed i po wywołaniu. Możemy to zobaserwować dzięki wywołaniu funkcji zwróconej przez dekorator (linia 17)

```python
def log_decorator(func):
    def wrapper():
        print("Before the function is called.")
        func()
        print("After the function is called.")
    return wrapper

def say_hello():
    print("Hello!")

say_hello_with_logs = log_decorator(say_hello)

# Console:
# > Before the function is called
# > Hello
# > After the function is called
say_hello_with_logs()
```

### Pobieranie danych

Kolejne zdanie, tym razem w React. Potrzebujesz funkcjonalność, która rozszerzy komponent o możliwość pobierania danych.

Dla uproszczenia przyjmijmy, że na kliknięcie pobieramy losowy cytat z serialu "Simpsonowie". Rozwiązanie musi być reaużywalne, pozwalające roszerzyć dowolny komponent.

Jedno z potencjalnych rozwiązań to Higher-Order Components (HOC). Jest to oczywiście implementacja wzorca dekoratora w React.

```tsx
//quote-containers.jsx
export const Paragraph = ({ quote, onRequest }) => <div>
  <p>{quote}</p>
  <button onClick={this.props.onRequest}>Click for new quote!</button>
</div>

export const Title = ({ quote, onRequest }) => <div>
  <h1>{quote}</h1>
  // ...some super fancy stuff here...
  <button onClick={this.props.onRequest}>Click for new quote!</button>
</div>

// withQuote.jsx
export const withQuote = WrappedComponent => {
  // return extended component with a possibility of getting quotes
  class ExtendedComponent extends Component {
    state = {
      quote: "",
    };

    onRequest = () => {
      fetch("https://thesimpsonsquoteapi.glitch.me/quotes")
        .then(response => response.json())
        .then({ quote } => {
          this.setState({ quote });
        })
        .catch(err => err);
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          quote={this.state.quote}
          onRequest={this.onRequest}
        />
      );
    }
  };

  return ExtendedComponent;
};
```

// describe

```tsx
// main.jsx
const TitleWithQuote = withQuote(Title);
const ParagraphWithQuote = withQuote(Paragraph);

const Main = () => (
  <>
    <TitleWithQuote />
    <ParagraphWithQuote />
  </>
);
```

## Niech Twój kod przmówi

Dobry kod powinien nieść możliwie najwięcej informacji dla czytelnika. Pokazywać intencje autora. Opisowe nazwy zmiennych to bardzo dobry początek, jednak dodatkowym źródłem informacji mogą stać się wzorce. Jeśli ktoś czyta kod i widzi informację o użyciu jakiegoś wzorca który zna, może łatwiej zdobyć szerszy kontekst i szybciej zrozumieć i odczytać intencje autora.

Posłużymy się wspomnianym dekoratorem. Powiedzmy, że programista przegląda kod projektu w React. Trafia on na instrukcję:

```javascript
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

Jeśli zna koncepcję HOC, wie że kod ten służy do rozszerzenia komponentu - jest implementacją wzorca dekoratora. Może wywnioskować, że autor chciał ukryć pewną powtarzalną logikę, a następnie rozszerzać o nią inne komponenty. Dzięki temu może łatwo przeanalizować co to za logika i czy będzie przydatna np. w ramach zmian, które wprowadza.

## To tylko narzędzie

Jak narazie powiedzieliśmy sobie tylko o zaletach używania wzorców. Jednak jak każde narzędzie posiadają wady. Wzorzec projektowy to kolejna warstwa abstrakcji. Tworzy to dodatkowy próg wejścia podczas analizy kodu, szczególnie jeśli czytelnik nie zna tego wzorca.

"Człowiekowi z młotkiem wszystko wydaje się gwoździem" jest bardzo trafnym stwierdzeniem w programowaniu. Bardzo często przywiązujemy się do jakiegoś rozwiązania tak mocno, że wszędzie widzimy jego poprawne zastosowanie. Tyczy się to również wzorców projektówych. Musimy pamiętać, że to tylko narzędzie. Dla jednych problemów jest idealne, dla innych nie. Skąd wiedzieć czy warto zastosować jakiś wzorzec? Przed wprowadzeniem określonego rozwiąznia porównaj korzyści jakie ono przynosi do strat. Takim stratami, może być wzrost złożności kodu, czy wydłużenie czasu analizowania kodu przez osoby które takiego wzorca nie znają. Zapytaj zespołu czy znają taki wzorzec. Pamiętaj, kod to też narzędzie komunikacji, nie utrudniaj jej dodając rzeczy które tylko Ty rozumiesz.

## Nie wkuwaj, używaj

Jak podejść do nauki wzorców? Najlepiej wykorzysując je w praktyce. Programując w React, nie użyjesz większości wzorców z programowania obiektowego. Nawet jeśli nauczysz się ich na pamięć, po pewnym czasie nieużywania, zapomnisz o większości. Trochę strata czasu co? Pisząc aplikację w React, sprawdź wzorce związane z tą biblioteką `react design patterns`. Ich poprawne użycie sprawi, że jakość Twojego kodu zwiększy się, a koncepcje za nim stojące staną się dla Ciebie proste i naturalne.

## Podsumowanie

W dzisiejszym artykule przedstawiłem wzorce projektowe. Dobrze użyte, są świetnym narzędziem zwiększającym jakość kodu.
Jednak jak w przypadku każdego narzędzia należy rozważyć plus i minusy stojące za jego użyciem. Jeśli dobrze je przeanalizujesz i odpowiednio zastosujesz wzorce, jakość i czytelność tworzonych przez Ciebie rozwiązań zwiększa sie diamentralnie.
