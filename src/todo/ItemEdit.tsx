import React, { useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const [nume, setNume] = useState<string>('');
  const [varsta, setVarsta] = useState<number>(0);
  const [echipa, setEchipa] = useState<string>('');
  const [pozitie, setPozitie] = useState<string>('');
  const [item, setItem] = useState<ItemProps>();
  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it._id === routeId);
    setItem(item);
    if (item) {
      setNume(item.nume);
      setVarsta(item.varsta);
      setEchipa(item.echipa);
      setPozitie(item.pozitie);
    }

  }, [match.params.id, items]);
  const handleSave = () => {
    const editedItem = item ? { ...item, nume, varsta, echipa, pozitie } : { nume, varsta, echipa, pozitie };
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };
  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="outline" onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput value={nume} onIonChange={e => setNume(e.detail.value || '')}>Numele jucatorului: </IonInput>
        <IonInput value={varsta} onIonChange={e => {
          if(e.detail.value == null)
            e.detail.value = '0'.toString();
          setVarsta(parseInt(e.detail.value, 10) || 0)}}>Varsta: </IonInput>
        <IonInput value={echipa} onIonChange={e => setEchipa(e.detail.value || '')}>Numele echipei: </IonInput>
        <IonInput value={pozitie} onIonChange={e => setPozitie(e.detail.value || '')}>Pozitia in teren: </IonInput>
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || 'Failed to save jucator'}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
