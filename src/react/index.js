import React from 'react';
import { createRoot } from 'react-dom/client';
import MainWindow from './view/mainWindow';
const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(<MainWindow/>);
