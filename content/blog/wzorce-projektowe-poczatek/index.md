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

Poniedziałek, przychodzisz rano do pracy. Jesteś cały mokry, deszcz nagle Cię zaskoczył. Okazuje się, że ekspres do kawy nie działa. Zastanawiasz się czy może być gorzej. Wtedy dostajesz taska: musisz dodać nowy formularz w jednym z pierwszych widoków aplikacji. Nogi uginają się pod Tobą, na skroni pojawia się pot, już wiesz że ten dzień będzie gorszy. Wielokrotnie słyszałeś o tej części projektu. Ten kod...każdy mówi o nim z przerażeniem. Wielu programistów już prosiło o jego przepisanie, niestety nie ma czasu i budżetu. Moduł jest zbyt duży. Każdy, który pracował z tym jest już dawno poza firmą, nie wytrzymali tego...teraz czas na Ciebie.

W tej nieco podkolorowanej historii znajdziemy prawdę o dwóch rzeczach, zmianach i czystym kodzie. Te rzeczy powinny być ze sobą powiązane. W innym przypadku praca Twoja jak i Twojego zespołu będzie przypominać tę z powyższej historii.
Nieustannie aktualizujemy nasz kod. Dodajemy nowe funkcjonalności, usuwamy zbędne rzeczy. Pytanie co zrobić, żeby produkować wysokiej jakości kod z którym inni będą chcieli pracować? Każdy dobry programista posiada zestaw narzędzi pozwalających na tworzenie takiego kodu, a jednym z elementów są wzorce projektowe.

## Wzorce projektowe, czyli co?

Implementujesz rozwiązanie pewnego problemu. Okazuje się ono tak dobre, że koledzy z pracy zaczynają go używać do rozwiązania podobnych problemów. Wreszcie Twój pomysł wychodzi poza firmę. Jest tak świetny, że staje się szablonem do rozwiązania danego problemu, którego używają programiści na całym świecie. Takie rozwiązanie nazwiemy wzorcem projektowym.

Dodajemy bardziej sformalizowany opis: w inżynierii oprogramowania wzorzec projektowy jest ogólnie powtarzalnym rozwiązaniem często występującego problemu w projektowaniu oprogramowania. Wzorzec projektu nie jest gotowym projektem lecz szablonem, który można przekształcić bezpośrednio w kod.

Dlaczego nie możemy uznać go za gotowe rozwiązanie? Bo programiści rozwiązują problemy w różnych środowiskach, choćby świat Frontendu i Backendu, stąd rozwiąnia nigdy nie będą się pokrywały.

Spójrzmy na następujący problem. Chcemy rozszerzyć abstrakcję (klasę, bądź funkcję) o dodatkową funkcjonalność. Wiemy, że będzie ona używana w kilku innych miejscach w oryginalnej postaci, dlatego nie możemy modyfikować jej kodu. Dodatkowo, nowa funkcjonalność będzie działać nieco inaczej w zależności od wartości pewnych zmiennych, innymi słowy musimy mieć możliwość utworzenia jej wykonywania programu (run-time). Jak podszedłbyś to takiego problemu?

Okazuje się, że jest rozwiązanie! A nazywa się ono dekorator. Programista może wykorzystać ten wzorzec jak szablon i zaimplementować rozwiązanie na nim bazujące. Jednak w zależności od środowiska, będzie się ono nieco rózniło. Tworząc aplikację w React, można użyć High-Order Components, ale implementacja w Pythonie zostanie oparta o składnię używającą `@` np. `@my_decorator`.

## Niech Twój kod będzie źródłem komunikacji

Dobry kod powinien nieść możliwie najwięcej informacji dla czytelnika. Pokazywać intencje autora. Opisowe nazwy zmiennych to jedno, jednak dodatkowym źródłem informacji mogą stać się wzorce. Jeśli ktoś czyta kod i widzi informację o użyciu jakiegoś wzorca, może łatwiej zdobyć szerzy kontekst i szybciej zrozumieć i odczytać intencje autora.

Posłużymy się jeszcze raz wzorem dekoratora. Powiedzmy, że programista przegląda kod projektu w React. Trafia on na instrukacje:

```javascript
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

Jeśli zna koncepcję HOC w React, wie że kod ten służy do rozszerzenia komponentu. Można wywnioskować, że autor chciał ukryć pewną powtarzalną logikę, w ramach HOC, a następnie rozszerzać o nią inne komponenty. Dzięki temu możemy łatwo przeanalizować co to za logika i czy będzie przydatna w ramach naszych zmian.

## To tylko narzędzie

"Człowiekowi z młotkiem wszystko wydaje się gwoździem" jest bardzo trafnym stwierdzeniem w programowaniu. Bardzo często przywiązujemy się do jakiegoś rozwiązania tak mocno, że wszędzie widzimy jego poprawne zastosowanie. Tyczy się to również wzorców projektówych. Musimy pamiętać, że to tylko narzędzie. Do jednych problemów nadaje się lepiej, do innych gorzej. Wzorzec projektowy to kolejna warstwa abstrakcji. Nie zawsze warto ją dokładać.
Moja rada to porównać na koszty i benefity jakie daje prowadzenie określonego narzedzia. Porównać jego złożność, a to ile dzięki niemu można zyskać. **Nie staraj się czegoś używać na siłę, bo sprawdziło się w innym miejscu.**. Przeanalizuj, podlicz zyski i straty i na tej podstawie podejmij decyzję.

## Przykłady wzorców projektowych w Javascript

### Decorator (kod + opis)

### Module (kod + opis)

## Podsumowanie
