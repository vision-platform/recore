import {
  action,
  computed,
  autorun,
  when,
  reaction,
  toJS,
  observe,
  intercept,
  observable,
  IObservableMapInitialValues,
  IObservableSetInitialValues,
  ObservableMap,
  ObservableSet,
  IObservableArray,
  IObservableValue,
  configure,
  untracked
} from "mobx";

export const obx = observable.ref;

export function obxMap<K = any, V = any>(
  initialValues?: IObservableMapInitialValues<K, V>
): ObservableMap<K, V> {
  return observable.map(initialValues, {
    deep: false,
  });
}

export function obxSet<T = any>(
  initialValues?: IObservableSetInitialValues<T>,
  name?: string
): ObservableSet<T> {
  return observable.set(initialValues, { deep: false, name });
}

export function obxArray<T = any>(
  initialValues?: T[],
  name?: string
): IObservableArray<T> {
  return observable.array(initialValues, { deep: false, name });
}

export function obxObject<T = any>(props: T, name?: string): T {
  return observable.object(props, undefined, { deep: false, name });
}

export function obxBox<T = any>(value?: T, name?: string): IObservableValue<T> {
  return observable.box(value, { deep: false, name });
}

configure({
  enforceActions: "never",
  reactionScheduler: (f) => nextTick(f),
});

export { action, computed, autorun, reaction, when, toJS, observe, intercept, untracked };



const callbacks: Array<() => void> = [];
let pending = false;

function flush() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (const fn of copies) {
    fn();
  }
}

let timerFlush: () => void;
if (typeof globalThis.Promise === 'function') {
  // tslint:disable-line
  const timer = globalThis.Promise.resolve(); // tslint:disable-line
  timerFlush = () => {
    timer.then(flush);
  };
} else {
  timerFlush = () => {
    setTimeout(flush, 0);
  };
}

export function clearTicks() {
  callbacks.length = 0;
}

export function nextTick(callback: () => void): void {
  callbacks.push(callback);

  if (!pending) {
    pending = true;
    timerFlush();
  }
}
