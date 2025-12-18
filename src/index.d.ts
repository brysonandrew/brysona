declare module '*.mid' {
  const content: any;
  export default content;
}

declare module '*.glb' {
  const content: any;
  export default content;
}

declare module '*.gltf' {
  const content: any;
  export default content;
}

declare module '*.obj' {
  const content: any;
  export default content;
}

declare module '*.max' {
  const content: any;
  export default content;
}

declare module '*.3ds' {
  const content: any;
  export default content;
}

declare module '*.tga' {
  const content: any;
  export default content;
}

declare module '*.mp4' {
  const content: any;
  export default content;
}

declare module '*.jpeg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.glsl' {
  const value: string;
  export default value;
}


interface AudioWorkletProcessor {
  readonly port: MessagePort;
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ): boolean;
}

declare const AudioWorkletProcessor: {
  prototype: AudioWorkletProcessor;
  new (
    options?: AudioWorkletNodeOptions,
  ): AudioWorkletProcessor;
};

interface AudioParamMap {
  get(name: string): any;
}

declare function registerProcessor(
  name: string,
  processorCtor: (new (
    options?: AudioWorkletNodeOptions,
  ) => AudioWorkletProcessor) & {
    parameterDescriptors?: AudioParamDescriptor[];
  },
): void;

declare module 'fs-extra';

// Google Maps type declarations
declare namespace google {
  namespace maps {
    namespace places {
      interface AutocompleteOptions {
        types?: string[];
        fields?: string[];
        componentRestrictions?: { country?: string | string[] };
        bounds?: any;
        strictBounds?: boolean;
      }

      interface PlaceResult {
        formatted_address?: string;
        name?: string;
        geometry?: {
          location?: {
            lat(): number;
            lng(): number;
          };
        };
        place_id?: string;
      }

      class Autocomplete {
        constructor(
          inputField: HTMLInputElement,
          opts?: AutocompleteOptions,
        );
        getPlace(): PlaceResult;
        addListener(
          eventName: string,
          handler: () => void,
        ): void;
      }

      interface PlaceAutocompleteElementOptions {
        requestedResultTypes?: string[];
        requestedFields?: string[];
        locationRestriction?: any;
        componentRestrictions?: { country?: string | string[] };
      }

      interface Place {
        formattedAddress?: string;
        formatted_address?: string;
        name?: string;
        displayName?: string;
        display_name?: string;
        geometry?: {
          location?: {
            lat: number;
            lng: number;
          };
        };
        place_id?: string;
      }

      class PlaceAutocompleteElement {
        constructor(opts?: PlaceAutocompleteElementOptions);
        input: HTMLInputElement | null;
        value: Place | null;
        addEventListener(
          eventName: 'gmp-placeselect',
          handler: (event: { place: Place }) => void,
        ): void;
        removeEventListener(
          eventName: 'gmp-placeselect',
          handler: (event: { place: Place }) => void,
        ): void;
      }
    }

    namespace event {
      function clearInstanceListeners(
        instance: any,
      ): void;
    }
  }
}
