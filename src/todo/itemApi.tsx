import axios, {AxiosResponse} from 'axios';
import { authConfig, baseUrl, getLogger, withLogs } from '../core';
import { ItemProps } from './ItemProps';

import { Plugins } from "@capacitor/core";
import {useNetwork} from "./useNetwork"; //capacitor plugin
const { Storage } = Plugins;

const itemUrl = `http://${baseUrl}/api/jucator`;

export const getItems: (token: string) => Promise<ItemProps[]> = (token) => {
  //return withLogs(axios.get(itemUrl, authConfig(token)), 'getItems');
  var result = axios.get(itemUrl, authConfig(token));
  result.then(function (result){
    result.data.forEach(async (item: ItemProps) => {
      await Storage.set({
        key: item._id!,
        value: JSON.stringify({
          id: item._id,
          nume: item.nume,
          varsta: item.varsta,
          echipa: item.echipa,
          pozitie: item.pozitie
        }),
      });
    });
  });
  return withLogs(result, "getItems");
}

export const createItem: (token: string, item: ItemProps) => Promise<ItemProps[]> = (token, item) => {
  //return withLogs(axios.post(itemUrl, item, authConfig(token)), 'createItem');
  try{
    var result = axios.post(itemUrl, item, authConfig(token));
    result.then(async function (result) {
      var item = result.data;
      await Storage.set({
        key: item._id!,
        value: JSON.stringify({
          id: item._id,
          nume: item.nume,
          varsta: item.varsta,
          echipa: item.echipa,
          pozitie: item.pozitie
        }),
      });
    });
    return withLogs(result, "createItem");
  }
  catch(error){
    Storage.set({
      key: item._id!,
      value: JSON.stringify({
        id: item._id,
        nume: item.nume,
        varsta: item.varsta,
        echipa: item.echipa,
        pozitie: item.pozitie
      }),
    });
    //notification = true;
    var x = new Promise<AxiosResponse<null>>(resolve => {});
    return withLogs(x, "createItem ONLY on local storage");
  }
}

export const updateItem: (token: string, item: ItemProps) => Promise<ItemProps[]> = (token, item) => {
  //return withLogs(axios.put(`${itemUrl}/${item._id}`, item, authConfig(token)), 'updateItem');
  try{
  var result = axios.put(`${itemUrl}/${item._id}`, item, authConfig(token));
  result.then(async function (result){
    var item = result.data;
    await Storage.set({
      key: item._id!,
      value: JSON.stringify({
        id: item._id,
        nume: item.nume,
        varsta: item.varsta,
        echipa: item.echipa,
        pozitie: item.pozitie
      }),
    });
  });
  return withLogs(result, "updateItem");
  }
  catch(error){
    Storage.set({
      key: item._id!,
      value: JSON.stringify({
        id: item._id,
        nume: item.nume,
        varsta: item.varsta,
        echipa: item.echipa,
        pozitie: item.pozitie
      }),
    });
    //notification = true;
    var x = new Promise<AxiosResponse<null>>(resolve => {});
    return withLogs(x, "updateItem ONLY on local storage");
  }
}

interface MessageData {
  type: string;
  payload: ItemProps;
}

const log = getLogger('ws');

export const newWebSocket = (token: string, onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket(`ws://${baseUrl}`)
  ws.onopen = () => {
    log('web socket onopen');
    ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
  };
  ws.onclose = () => {
    log('web socket onclose');
  };
  ws.onerror = error => {
    log('web socket onerror', error);
  };
  ws.onmessage = messageEvent => {
    log('web socket onmessage');
    onMessage(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  }
}
