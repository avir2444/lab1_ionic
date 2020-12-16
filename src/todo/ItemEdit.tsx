import React, { useContext, useEffect, useState } from 'react';
import {
  IonActionSheet,
  IonButton,
  IonButtons, IonCol,
  IonContent, IonFab, IonFabButton, IonGrid,
  IonHeader, IonIcon, IonImg,
  IonInput,
  IonLoading,
  IonPage, IonRow,
  IonTitle, IonToast,
  IonToolbar
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';

import { camera, close, trash } from 'ionicons/icons';
import { Photo, usePhotoGallery } from './usePhotoGallery';

import { MyMap } from '../map.components/MyMap';
import {useCoordsGallery} from "./useCoords";

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

  const { photos, takePhoto, deletePhoto } = usePhotoGallery();
  const { coords, takeCoords} = useCoordsGallery();
  const [photoToDelete, setPhotoToDelete] = useState<Photo>();

  const [latitude, setLatitude] = useState(45.85);
  const [longitude, setLongitude] = useState(25.0);

  useEffect(() =>{
    coords.map((coord, index) => {
          if (coord.id == item?._id){
            setLatitude(coord.lat);
            setLongitude(coord.lot);
        }
    })
    log(latitude)
  },[coords])

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

  const handleSaveCoords = () => {
    handleSave();
    let coord = takeCoords(item?._id||"x",latitude, longitude);
  };
  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="outline" onClick={handleSaveCoords}>
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

        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => {
                  if (photo.filepath == (item?._id + ".jpeg")){
                  return(
                    <IonCol size="4" key={index}>
                      <IonImg onClick={() => setPhotoToDelete(photo)}
                              src={photo.webviewPath}/>
                    </IonCol>)
                  }
                }
            )}
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => {if(item?._id != undefined) return takePhoto(item?._id||"x")}}>
            <IonIcon icon={camera}/>
          </IonFabButton>
        </IonFab>
        <IonActionSheet
            isOpen={!!photoToDelete}
            buttons={[{
              text: 'Delete',
              role: 'destructive',
              icon: trash,
              handler: () => {
                if (photoToDelete) {
                  deletePhoto(photoToDelete);
                  setPhotoToDelete(undefined);
                }
              }
            }, {
              text: 'Cancel',
              icon: close,
              role: 'cancel'
            }]}
            onDidDismiss={() => setPhotoToDelete(undefined)}
        />
        <div>My Location is</div>
        <div>latitude: {latitude}</div>
        <div>longitude: {longitude}</div>
        {latitude && longitude &&
        <MyMap
            lat={latitude}
            lng={longitude}
            onMapClick={(location: any) => {
              setLatitude(location.latLng.lat());
              setLongitude(location.latLng.lng());
            }}
        />}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
