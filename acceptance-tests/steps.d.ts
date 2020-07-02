/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file.js');
type Roster = typeof import('./fragments/Roster');

declare namespace CodeceptJS {
  interface SupportObject {
    I: CodeceptJS.I,
    Roster: Roster
  }

  interface CallbackOrder {
    [0]: CodeceptJS.I;
    [1]: Roster
  }

  interface Methods extends CodeceptJS.WebDriver {
  }

  interface I extends ReturnType<steps_file> {
  }

  namespace Translation {
    interface Actions {
    }
  }
}
