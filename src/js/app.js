/* eslint-disable no-console */
/* eslint-disable arrow-parens */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-template */
import { ajax } from 'rxjs/ajax';
import { switchMap, map, catchError } from 'rxjs/operators';
import { interval, of } from 'rxjs';

const api = 'http://localhost:7070/api/messages';
const form = document.querySelector('.messages');
const cutString = str => {
  return str.length > 15 ? str.slice(0, 15) + '...' : str;
};
function postMessage(messages) {
  form.innerHTML = '';
  messages.forEach((message) => {
    const subject = cutString(message.subject);
    const time = new Date(message.received);
    const result = time.toLocaleString('ru-Ru', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    result.replace(/[,%]/g, '');
    const text = `<div class="message">
      <p>${message.from}</p>
      <p>${subject}</p>
      <p>${result}</p>
      </div>`;
    form.insertAdjacentHTML('afterbegin', text);
  });
}
const sub = interval(1000)
  .pipe(
    switchMap(() => {
      return ajax.getJSON(api).pipe(
        map(messages => messages.messages),
        catchError(error => {
          console.log('error: ', error);
          return of(error);
        }),
      );
    }),
  )
  .subscribe((messages) => {
    postMessage(messages);
  });
setTimeout(() => {
  sub.unsubscribe();
  const text = '<p class="text">Новых сообщений нет</p>';
  form.insertAdjacentHTML('beforebegin', text);
}, 5000);
