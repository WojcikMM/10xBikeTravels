# AI Integration in 10xBikeTravels

## Overview

10xBikeTravels wykorzystuje modele języka (LLM) z OpenRouter.ai do generowania spersonalizowanych tras motocyklowych. Ten dokument opisuje szczegóły implementacji i integracji z API.

## Architektura

```
┌─────────────────┐         ┌────────────────┐         ┌─────────────────┐
│                 │  HTTP   │                │  HTTP   │                 │
│ React Component │ ───────►│ AI Service API │ ───────►│ OpenRouter API  │
│                 │         │                │         │                 │
└─────────────────┘         └────────────────┘         └─────────────────┘
        ▲                           ▲
        │                           │
        │                           │
┌───────┴─────────┐         ┌──────┴─────────┐
│                 │         │                │
│ User Interface  │         │  MSW Testing   │
│                 │         │  Interceptors  │
└─────────────────┘         └────────────────┘
```

## Implementacja

### 1. OpenRouter Service

Główny moduł usługi AI zaimplementowany w `lib/ai/openrouter-service.ts`:

- Obsługuje uwierzytelnianie z OpenRouter
- Buduje prompt na podstawie preferencji użytkownika
- Waliduje odpowiedzi z wykorzystaniem Zod
- Obsługuje ponowne próby i błędy

### 2. Generowanie Tras

Proces generowania trasy wykorzystuje starannie zaprojektowany prompt, który:

1. Zawiera rolę systemową definiującą eksperta planowania tras motocyklowych w Polsce
2. Przekazuje preferencje użytkownika:
   - Punkt startowy
   - Priorytet trasy (widokowa, kręta, unikanie autostrad)
   - Dystans lub czas trwania
   - Typ motocykla (jeśli podany)
3. Definiuje oczekiwany format odpowiedzi (JSON z punktami trasy)
4. Zawiera dodatkowe instrukcje zapewniające realistyczne trasy

### 3. Przetwarzanie Odpowiedzi

Odpowiedź z modelu LLM jest przetwarzana przez aplikację, aby:

1. Zweryfikować poprawność struktury JSON
2. Sprawdzić, czy punkty trasy mają prawidłowe współrzędne (w granicach Polski)
3. Przekształcić dane do formatu używanego przez interfejs użytkownika

### 4. Testy AI

Do testowania integracji AI używamy MSW, aby:

1. Przechwytywać żądania do OpenRouter API
2. Symulować różne odpowiedzi (powodzenia, błędy, nieprawidłowe formaty)
3. Testować logikę obsługi błędów bez wykonywania rzeczywistych wywołań API

## Przyszły Rozwój

1. **Walidacja tras**: Wykorzystanie dodatkowych API do weryfikacji przejezdności trasy
2. **Rozszerzenie geograficzne**: Obsługa generowania tras poza Polską
3. **Doskonalenie promptów**: Ciągłe iteracje w celu poprawy jakości generowanych tras
4. **Caching wyników**: Zmniejszenie kosztów przez przechowywanie popularnych wyników

## Konfiguracja

Wymagane zmienne środowiskowe:

```
NEXT_PUBLIC_OPENROUTER_KEY=your_api_key
NEXT_PUBLIC_OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
NEXT_PUBLIC_OPENROUTER_MODEL=preferred_model_id
NEXT_PUBLIC_OPENROUTER_APP_URL=your_app_url
``` 