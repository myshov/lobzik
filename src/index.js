export class Observable {
    constructor(forEach) {
        if (typeof forEach !== 'function') {
            throw new Error(
                'Constructor of Observable should be ' +
                'invoked with a function as parameter, got ' + typeof forEach);
        }
        this._forEach = forEach;
    }

    static fromEvent(domNode, eventName) {
        return new Observable(observer => {
            function handler(e) {
                observer.next(e);
            }

            domNode.addEventListener(eventName, handler);

            return {
                unsubscribe() {
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
                error: observer.error,
                complete: observer.complete,
            });
        } else if (
            args.length === 3
            && typeof args[0] === 'function'
            && typeof args[1] === 'function'
            && typeof args[2] === 'function'
        ) {
            const [next, error, complete] = args;
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

    mergeAll() {
        // TODO
    }

    switch() {
        // TODO
    }
}
