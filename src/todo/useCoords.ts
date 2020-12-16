import {useCamera} from "@ionic/react-hooks/camera";
import {useEffect, useState} from "react";
import {CameraPhoto, CameraResultType, CameraSource, FilesystemDirectory} from "@capacitor/core";
import {base64FromPath, useFilesystem} from "@ionic/react-hooks/filesystem";
import {useStorage} from "@ionic/react-hooks/storage";
import {promises} from "fs";
import {log} from "util";

export interface Coords{
    id: string
    lat: number;
    lot: number;
}

const COORDS_STORAGE = 'coords';

export function useCoordsGallery() {

    const [coords, setCoords] = useState<Coords[]>([]);

    const takeCoords = async (id: string, lat: number, lot: number) => {
        var newCoords = coords.filter(c => c.id !== id);
        await set(COORDS_STORAGE, JSON.stringify(newCoords));
        let c : Coords = {
            id: id,
            lat: lat,
            lot: lot
        }
        newCoords = [c, ...newCoords];
        setCoords(newCoords);
        await set(COORDS_STORAGE, JSON.stringify(newCoords));
    };

    const { get, set } = useStorage();
    useEffect(() => {
        const loadSaved = async () => {
            const coordsString = await get(COORDS_STORAGE);
            const coords = (coordsString ? JSON.parse(coordsString) : []) as Coords[];
            setCoords(coords);
        };
        loadSaved();
    }, [get]);


    return {
        coords,
        takeCoords,
    };
}