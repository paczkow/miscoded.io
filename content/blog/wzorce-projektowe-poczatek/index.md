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

Dodajemy bardziej sformalizowany opis: wzorzec projektowy jest ogólnym rozwiązaniem często występującego problemu w projektowaniu oprogramowania. Nie jest on gotowym projektem lecz szablonem, który można przekształcić bezpośrednio w kod.

Dlaczego nie możemy uznać go za gotowe rozwiązanie? Bo programiści rozwiązują problemy w różnych środowiskach, choćby świat Frontendu i Backendu, stąd rozwiąznia nigdy nie będą się pokrywały.

## Jeden wzorzec, różne implementacje

Spójrzmy na następujący problem. Chcemy rozszerzyć abstrakcję (klasę, bądź funkcję) o dodatkową funkcjonalność. Wiemy, że będzie ona używana w kilku innych miejscach w oryginalnej postaci, dlatego nie możemy modyfikować jej kodu. Dodatkowo, nowa funkcjonalność będzie działać nieco inaczej w zależności od wartości pewnych zmiennych, innymi słowy musimy mieć możliwość utworzenia jej w czasie wykonywania programu (run-time). Jak podszedłbyś to takiego problemu?

Okazuje się, że jest rozwiązanie! A nazywa się ono dekorator. Programista może wykorzystać ten wzorzec jak szablon i zaimplementować rozwiązanie na nim bazujące. Jednak w zależności od środowiska, będzie się ono nieco rózniło. Tworząc aplikację w React, można użyć High-Order Components, ale implementacja w Pythonie zostanie oparta o składnię używającą `@` np. `@my_decorator`.

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

## Przykłady wzorców projektowych w Javascript

### Dekorator (ang. Decorator)

### Obserwator (ang. Observer)

### Moduł (ang. Module)

## Podsumowanie

W dzisiejszym artykule przedstawiłem wzorce projektowe. Dobrze użyte, są świetnym narzędziem zwiększającym jakość kodu.
Jednak jak w przypadku każdego narzędzia należy rozważyć plus i minusy stojące za jego użyciem. Jeśli dobrze je przeanalizujesz i odpowiednio zastosujesz wzorce, jakość i czytelność tworzonych przez Ciebie rozwiązań zwiększa sie diamentralnie.
