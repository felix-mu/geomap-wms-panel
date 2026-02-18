import { isValidZoomLevel, MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL, isValidZoomLevelConfiguration, getValidationMessage, getCurrentMapViewZoomLevel } from "./minMaxZoomLevelEditorUtils";

import { cleanup, render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { MinMaxZoomLevelEditor } from "./MinMaxZoomLevelEditor";
import React from "react";
import { ExtendMapLayerOptions } from "extension";
import userEvent from '@testing-library/user-event'

jest.mock('./minMaxZoomLevelEditorUtils', () => {
    const actual = jest.requireActual("./minMaxZoomLevelEditorUtils");

    return {
        __esModule: true,
        ...actual,
        getCurrentMapViewZoomLevel: jest.fn(),
    }
});

describe("tests for isValidZoomLevel", () => {
    test("undefined input should return true", () => {
        expect(isValidZoomLevel()).toBeTruthy();
        expect(isValidZoomLevel(undefined)).toBeTruthy();
    });

    test("max zoom level input should return true", () => {
        expect(isValidZoomLevel(MAX_ZOOM_LEVEL)).toBeTruthy();
    });

    test("min zoom level input should return true", () => {
        expect(isValidZoomLevel(MIN_ZOOM_LEVEL)).toBeTruthy();
    });

    test("input between min and max zoom level should return true", () => {
        expect(isValidZoomLevel(Math.floor((MIN_ZOOM_LEVEL + MAX_ZOOM_LEVEL) / 2))).toBeTruthy();
    });

    test("input exceeding max zoom level should throw an error", () => {
        expect(() => isValidZoomLevel(MAX_ZOOM_LEVEL + 1)).toThrow();
    });

    test("input subceeding min zoom level should throw an error", () => {
        expect(() => isValidZoomLevel(MIN_ZOOM_LEVEL - 1)).toThrow();
    });
});

describe("tests for isValidZoomLevelConfiguration", () => {
    test("undefined input for both parameters should return true", () => {
        expect(isValidZoomLevelConfiguration(undefined, undefined)).toBeTruthy();
    });

    test("one exclusive undefined input parameter should return true", () => {
        expect(isValidZoomLevelConfiguration(undefined, 1)).toBeTruthy();
        expect(isValidZoomLevelConfiguration(1, undefined)).toBeTruthy();
    });

    test("if both input parameters are defined and minZomm < maxZoom should return true", () => {
        expect(isValidZoomLevelConfiguration(1, 2)).toBeTruthy();
    });

    test("if both input parameters are defined and minZomm == maxZoom should return true", () => {
        expect(isValidZoomLevelConfiguration(1, 1)).toBeTruthy();
    });

    test("if both input parameters are defined and minZomm > maxZoom should hrow an error", () => {
        expect(() => isValidZoomLevelConfiguration(2, 1)).toThrow();
    });
});

describe("tests for getValidationMessage", () => {
    test("a function that throws an error should return its error message", () => {
        const errorMsg = getValidationMessage(() => {
            throw new Error("error_message");
        });
        expect(errorMsg).toEqual("Error: error_message");
    });

    test("a function that does not throw an error should return an empty string", () => {
        const errorMsg = getValidationMessage(() => {
            
        });
        expect(errorMsg.length).toEqual(0);
    });
});

describe("tests for MinMaxZoomLevelEditor", () => {
    test("clicking the min zoom level button should set the input value of the min zoom input to the zoom value of the map view zoom level",
        async () => {
            const extendMapLayerOptions: ExtendMapLayerOptions<any> = {
                type: ""
            };
            (getCurrentMapViewZoomLevel as jest.Mock).mockReturnValue(3);
            render(<MinMaxZoomLevelEditor value={extendMapLayerOptions} onChange={function(options: ExtendMapLayerOptions<any>): void { } } />);
            const minZoomButton = screen.getByTestId("minmaxzoomleveleditor min zoom level button");
            await userEvent.click(minZoomButton);
            const minZoomInput = screen.getByTestId("minmaxzoomleveleditor min zoom level input");
            expect(minZoomInput).toHaveValue(3);
            cleanup();
    });

    test("clicking the max zoom level button should set the input value of the max zoom input to the zoom value of the map view zoom level",
        async () => {
            const extendMapLayerOptions: ExtendMapLayerOptions<any> = {
                type: ""
            };
            (getCurrentMapViewZoomLevel as jest.Mock).mockReturnValue(3);
            render(<MinMaxZoomLevelEditor value={extendMapLayerOptions} onChange={function(options: ExtendMapLayerOptions<any>): void { } } />);
            const maxZoomButton = screen.getByTestId("minmaxzoomleveleditor max zoom level button");
            await userEvent.click(maxZoomButton);
            const maxZoomInput = screen.getByTestId("minmaxzoomleveleditor max zoom level input");
            expect(maxZoomInput).toHaveValue(3);
            cleanup();
    });

    // TODO:...
});
