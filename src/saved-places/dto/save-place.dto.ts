

export class SavePlaceDto {

    readonly type: string;

    readonly properties: object;

    readonly geometry: {
        readonly type: string;
        readonly coordinates: [number, number];
    }

}