/*
 * Copyright (c) 2015-2017 Codenvy, S.A.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Codenvy, S.A. - initial API and implementation
 */
'use strict';
import * as Keycloak from '../../keycloak/keycloak';

/**
 * This class is handling the call to remote API to login
 * @author Florent Benoit
 */
export class CheRemoteLogin {

  /**
   * Default constructor using angular $resource and remote URL
   * @param $resource the angular $resource object
   * @param url the remote server URL
   */
  constructor($resource, url, keycloak) {
    this.$resource = $resource;
    this.url = url;
    this.keycloak = keycloak;
    this.remoteAuthAPI = this.$resource('', {}, {
      auth: {method: 'POST', url: url + '/api/auth/login'}
    });
  }

  /**
   * Authenticate on the remote URL the provided username/password
   * @param login the login on remote URL
   * @param password the password on remote URL
   * @returns {*|promise|N|n}
   */
  authenticate(login, password) {
    let authData = {username: login, password: password};
    let call = this.remoteAuthAPI.auth(authData);
    let promise = call.$promise;

     if (keycloak && keycloak.token) {
        keycloak.updateToken(5).success(function () {
          console.log('REMOTE LOGIN : injecting token : ' + this.url);
          return promise.then((result) => {
            let token = result.value;
            return { 'REMOTE LOGIN: url': this.url, 'token': keycloak.token };
          });
        }).error(function () {
          console.log('REMOTE LOGIN: token refresh failed :' + config.url);

        });
     }
     return promise.then((result) => {
       let token = result.value;
       return { 'url': this.url, 'token': token };
     });

  }

}
