import React, {useContext, useState, useEffect} from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel,
  IonList, IonLoading,
  IonPage, IonSearchbar, IonSelect, IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { football } from 'ionicons/icons';
import Item from './Item';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { AuthContext } from "../auth";
import {ItemProps} from "./ItemProps";

const log = getLogger('ItemList');

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(ItemContext);

  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
  const [pos, setPos] = useState(4);

  const [filter, setFilter] = useState<string | undefined>("orice varsta");
  const selectOptions = ["< 18 ani", ">= 18 ani", "orice varsta"];
  const [searchText, setSearchText] = useState<string>("");

  const [itemsMatch, setItemsMatch] = useState<ItemProps[]>([]);

  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout?.();
    return <Redirect to={{ pathname: "/login" }} />;
  };

  async function searchNext($event: CustomEvent<void>) {
    if (items && pos < items.length) {
      setItemsMatch([...items.slice(0, 4 + pos)]); //
      setPos(pos + 4);
    } else {
      setDisableInfiniteScroll(true);
    }
    log('items from ' + 0 + " to " + pos)
    log(itemsMatch)
    await ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

  log('render');

  useEffect(() => {
    if (items?.length) {
      setItemsMatch(items.slice(0, pos));
    }
  }, [items]);

  //filtru
  useEffect(() => {
    if (filter && items) {
      if(filter === ">= 18 ani") {
        setItemsMatch(items.filter((item) => item.varsta >= 18));
      }
      else if(filter === "< 18 ani"){
        setItemsMatch(items.filter((item) => item.varsta < 18));
      }
      else if(filter === "orice varsta"){
        setItemsMatch(items);
      }
    }
  }, [filter]);

  //cautare
  useEffect(() => {
    if(searchText === "" && items){
      setItemsMatch(items);
    }
    if (searchText && items) {
      setItemsMatch(items.filter((item) => item.nume.startsWith(searchText)));
    }
  }, [searchText]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="end" onClick={handleLogout}>Logout</IonButton>
          <IonTitle>Cupa Campionilor Danone</IonTitle>
        </IonToolbar>
        <IonSearchbar color="dark" value={searchText} debounce={750} onIonChange={(e) => setSearchText(e.detail.value!)}/>
        <IonItem color="dark">
          <IonLabel>Filtrati jucatorii dupa varsta</IonLabel>
          <IonSelect value={filter} onIonChange={(e) => setFilter(e.detail.value)}>
            {selectOptions.map((option) => (
                <IonSelectOption key={option} value={option}>
                  {option}
                </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={fetching} message="Fetching items" />
        {/*{items && (
          <IonList>
            {items.map(({ _id, nume, varsta,echipa,pozitie}) =>
              <Item key={_id} _id={_id} nume={nume} varsta={varsta} echipa={echipa} pozitie={pozitie} onEdit={_id => history.push(`/jucator/${_id}`)} />)}
          </IonList>
        )}*/}
        {itemsMatch &&
        itemsMatch.map((item: ItemProps) => {
          return (
              <IonList>
                <Item key={item._id} _id={item._id} nume={item.nume} varsta={item.varsta} echipa={item.echipa} pozitie={item.pozitie} onEdit={id => history.push(`/jucator/${id}`)} />
              </IonList>
          );
        })}
        <IonInfiniteScroll threshold="75px" disabled={disableInfiniteScroll} onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
          <IonInfiniteScrollContent loadingSpinner="crescent" loadingText="Se incarca jucatorii..."/>
        </IonInfiniteScroll>
        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/jucator')}>
            <IonIcon icon={football} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
