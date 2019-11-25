const noop = () => {};

export class Observable {
    constructor(forEach) {
        if (typeof forEach !== 'function') {
            throw new Error(
                'Constructor of Observable should be ' +
                'invoked with a function as parameter, got ' + typeof forEach);
        }
        this._forEach = forEach;
    }

    static wrap(x) {
        return new Observable(observer => {
            observer.next(x);
            observer.complete();
            return {
                unsubscribe() {}
            }
        });
    }

    static fromEvent(domNode, eventName) {
        return new Observable(observer => {
            function handler(e) {
                observer.next(e);
            }

            domNode.addEventListener(eventName, handler);

            return {
                unsubscribe() {
                    // TODO: handle sequential unsubscribing
                    observer.complete();
                    domNode.removeEventListener(eventName, handler);
                }
            };
        });
    }

    static interval(time) {
        return new Observable(observer => {
            let i = 0;
            const id = setInterval(() => {
                observer.next(i++);
            }, time);

            return {
                unsubscribe() {
                    // TODO: handle sequential unsubscribing
                    clearInterval(id);
                    observer.complete();
                }
            };
        });
    }

    forEach(...args) {
        if (
            args.length === 1
            && typeof args[0] === 'object'
        ) {
            const observer = args[0];
            return this._forEach({
                next: observer.next,
                error: observer.error || noop,
                complete: observer.complete || noop,
            });
        } else if (
            args.length === 1
            && typeof args[0] === 'function'
        ) {
            const [next, error = noop, complete = noop] = args;
            return this._forEach({
                next,
                error,
                complete,
            });
        } else {
            throw new Error(
                'Couldn\'t iterate through ' + 
                'source because of incorrect parameters');
        }
    }

    filter(predicate) {
        return new Observable(observer => {
            return this.forEach({
                next(data) {
                    if (predicate(data)) {
                        observer.next(data);
                    }
                },
                complete: observer.complete,
                error: observer.error,
            });
        });
    }

    map(projectionFn) {
        return new Observable(observer => {
            return this.forEach({
                next(data) {
                    observer.next(projectionFn(data));
                },
                complete: observer.complete,
                error: observer.error,
            });
        });
    }

    take(number) {
        return new Observable(observer => {
            let counter = 0;
            const sub =  this.forEach({
                next(data) {
                    counter++;
                    if (number >= counter) {
                        observer.next(data);
                    } else {
                        sub.unsubscribe();
                    }
                },
                complete: observer.complete,
                error: observer.error,
            });
            return sub;
        });
    }

    merge() {
        return new Observable(observer => {
            const sub = this.forEach({
                next(innerObservable) {
                    innerObservable.forEach(
                        observer.next
                    );
                },
                complete: observer.complete,
                error: observer.error,
            });
            return sub;
        });
    }

    reduce() {
        // TODO
    }

    zip() {
        // TODO
    }

    takeUntil() {
        // TODO
    }

    concatAll() {
        // TODO
    }

    switch() {
        // TODO
    }
}
