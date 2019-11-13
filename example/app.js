import {Observable} from '../src/index.js';

const numbers$ = Observable.interval(500);
const clicks$ = Observable.fromEvent(document.getElementById('btn'), 'click');
const sub = numbers$
    .filter(i => i % 2 === 0)
    .map(i => i * 10)
    .forEach({
        next(i) {
            console.log('got ', i);
        },
        complete() {
            console.log('completed');
        }
    });

setTimeout(sub.unsubscribe, 5000);
