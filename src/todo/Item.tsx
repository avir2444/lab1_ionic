import React from 'react';
import {IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonLabel} from '@ionic/react';
import { ItemProps } from './ItemProps';
import {colorFill} from "ionicons/icons";

interface ItemPropsExt extends ItemProps {
  onEdit: (_id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ _id, nume, varsta, echipa, pozitie, onEdit }) => {
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
    </IonItem>
  );
};

export default Item;
