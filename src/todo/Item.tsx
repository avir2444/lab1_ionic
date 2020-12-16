import React from 'react';
import {
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonImg,
    IonItem,
    IonLabel
} from '@ionic/react';
import { ItemProps } from './ItemProps';
import {buildSharp, colorFill} from "ionicons/icons";
import {Photo, usePhotoGallery} from "./usePhotoGallery";
import {log} from "util";
import {type} from "os";

interface ItemPropsExt extends ItemProps {
  onEdit: (_id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ _id, nume, varsta, echipa, pozitie, onEdit }) => {
    const { photos } = usePhotoGallery();

    let p: Photo = {
        filepath: "",
        webviewPath: ""
    };
    photos.map((photo, index) => {
        if (photo.filepath == (_id + ".jpeg")) {
            p = photo;
        }
    })
    return (
    <IonItem onClick={() => onEdit(_id)}>
        <IonCard>
            <IonCardHeader>
                <IonItem>
                    <IonCardSubtitle>
                        <IonLabel color="dark">{nume}</IonLabel>
                    </IonCardSubtitle>
                </IonItem>
                <IonCardTitle>
                    <IonLabel color="light">Varsta: {varsta} ani</IonLabel>
                </IonCardTitle>
                <IonCardTitle>
                    <IonLabel>Echipa: {echipa}</IonLabel>
                </IonCardTitle>
                <IonCardTitle>
                    <IonLabel>Pozitie: {pozitie}</IonLabel>
                </IonCardTitle>
            </IonCardHeader>
        </IonCard>
        <img src={p.webviewPath} style={{ height: 100, width: 100 }} />
    </IonItem>
);
};

export default Item;
