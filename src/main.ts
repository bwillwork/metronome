import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { error } from './app/util/loggerUtil';

bootstrapApplication(App, appConfig)
  .catch(error);
