**Cel Proof of Concept (POC):**

Zweryfikowanie technicznej możliwości i podstawowej jakości generowania interesujących tras motocyklowych na terenie Polski przy użyciu modelu językowego (LLM) dostępnego przez Openrouter.ai, w ramach zdefiniowanego stacku technologicznego. POC ma objąć **podstawowy przepływ użytkownika**: logowanie, zdefiniowanie preferencji w profilu, generowanie trasy z uwzględnieniem tych preferencji, zapisanie wygenerowanej trasy oraz jej późniejsze przeglądanie i usuwanie. POC ma również potwierdzić działanie integracji z Supabase dla autentykacji i przechowywania danych (preferencji profilu i zapisanych tras).

**Wykorzystany Stack Technologiczny (zgodnie z `tech-stack.md`):**

*   **Frontend:** Next.js z React 19, TypeScript 5, biblioteka komponentów `ant-design`, `styled-components` (dla ewentualnych customizacji).
*   **Backend/BaaS:** Supabase (dla autentykacji użytkowników, przechowywania danych profilu i zapisanych tras).
*   **AI:** Model językowy dostępny przez Openrouter.ai.

**Kluczowa funkcjonalność do zaimplementowania w POC:**

1.  **Autentykacja Użytkownika:**
    *   Implementacja prostego formularza logowania (`ant-design`).
    *   Integracja z Supabase Auth.
    *   Dostęp do pozostałych funkcji **tylko dla zalogowanych użytkowników**. (Rejestracja może być pominięta na rzecz predefiniowanego konta testowego).

2.  **Profil Użytkownika (minimalny):**
    *   Strona profilu dostępna po zalogowaniu.
    *   Możliwość wybrania i zapisania przez użytkownika preferowanego **głównego priorytetu trasy** (lista: "Trasa widokowa", "Trasa kręta", "Unikanie autostrad" - użyj np. `Select` z `ant-design`).
    *   *Opcjonalnie (do testów):* Możliwość zapisania typu motocykla.
    *   Zapisanie wybranych preferencji w bazie danych Supabase (w tabeli powiązanej z ID użytkownika, np. `profiles`).

3.  **Interfejs Generowania Trasy:**
    *   Strona dostępna po zalogowaniu (`ant-design`).
    *   Formularz pozwalający użytkownikowi wprowadzić:
        *   Punkt startowy (tekst - `Input`).
        *   Główny priorytet trasy:
            *   Opcja użycia **preferencji zapisanej w profilu** (domyślnie).
            *   Możliwość **nadpisania** priorytetu dla tego konkretnego generowania (wybór z listy - `Select`).
        *   Planowany dystans (km) LUB szacowany czas przejazdu (godziny - `InputNumber`).
        *   *Opcjonalnie (do testów):* Typ motocykla (jeśli zaimplementowano w profilu, możliwość nadpisania).
    *   Przycisk (`Button`) inicjujący generowanie.

4.  **Logika Generowania Trasy:**
    *   Pobranie preferencji z profilu użytkownika (jeśli wybrano tę opcję) lub użycie wartości nadpisanej w formularzu.
    *   Przygotowanie odpowiedniego promptu dla LLM (uwzględniającego punkt startowy, wybrany priorytet, dystans/czas, opcjonalnie typ motocykla, ograniczenie do Polski).
    *   Komunikacja z LLM przez Openrouter.ai.

5.  **Prezentacja Wyniku i Zapis Trasy:**
    *   Wyświetlenie wyniku z LLM (`Typography`, `Card`/`Collapse`): Tytuł, Podsumowanie, Lista punktów JSON (z opcją kopiowania).
    *   Przycisk (`Button`) "Zapisz trasę" widoczny obok wygenerowanego wyniku.
    *   Logika zapisująca wygenerowaną trasę (tytuł, podsumowanie, JSON z punktami, parametry wejściowe użyte do generowania) w bazie Supabase (w tabeli powiązanej z ID użytkownika, np. `saved_routes`).

6.  **Zarządzanie Zapisanymi Trasami:**
    *   Osobna strona/sekcja dostępna po zalogowaniu, wyświetlająca listę zapisanych tras użytkownika (pobranych z Supabase, prezentacja np. tytułów i podsumowań w `List` z `ant-design`).
    *   Możliwość kliknięcia w zapisaną trasę, aby zobaczyć jej szczegóły (pełny JSON i parametry wejściowe).
    *   Możliwość usunięcia zapisanej trasy (przycisk `Delete` przy każdej trasie na liście, wykonujący operację usunięcia rekordu z Supabase).

**Funkcjonalności WYKLUCZONE z zakresu POC:**

*   Pełny system rejestracji użytkowników.
*   Wizualizacja trasy na mapie.
*   Ocena tras (np. gwiazdki).
*   Generowanie alternatywnych propozycji dla tych samych parametrów (przycisk "Generuj inną").
*   Zaawansowana obsługa błędów LLM.
*   Zaawansowany prompt engineering i walidacja odpowiedzi LLM.
*   Wszelkie inne funkcje z PRD nieujęte w powyższych punktach.

**Prośba do generatora:**

**Zanim rozpoczniesz implementację kodu POC, przedstaw proszę najpierw plan pracy.** Plan powinien wyszczególniać kroki potrzebne do stworzenia opisanego, rozszerzonego POC, wskazując, jak zostaną zrealizowane kluczowe punkty (autentykacja, UI profilu, UI generowania, komunikacja z LLM, zapis/odczyt/usuwanie tras z Supabase, prezentacja wyników i listy). **Po przedstawieniu planu, poczekaj na moją akceptację przed przejściem do generowania kodu.**