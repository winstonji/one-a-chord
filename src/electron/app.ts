const fs = require('fs')
import { app, BrowserWindow } from 'electron'
import Main from './main'

Main.main(app, BrowserWindow)
