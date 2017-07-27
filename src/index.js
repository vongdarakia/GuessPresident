import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GuessPresidentApp from './GuessPresidentApp';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<GuessPresidentApp />, document.getElementById('root'));
registerServiceWorker();
