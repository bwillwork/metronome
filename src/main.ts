import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { error } from './app/util/logger';

bootstrapApplication(App, appConfig)
  .catch(error);
