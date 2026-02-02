import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';
import { ExtentMapViewEditor, getCurrentMapExtent, parseMapViewExtent } from './ExtentMapViewEditor';
import React from 'react';
import { lastGeomapPanelInstance } from 'GeomapPanel';
import userEvent from '@testing-library/user-event';

jest.mock('GeomapPanel');

describe("tests for parseMapViewExtent", () => {
    test("too few coordinates in the string should throw error", () => {
        expect(() => parseMapViewExtent("1234")).toThrow();
    });

    test("wrong delimiter should should throw error", () => {
        expect(() => parseMapViewExtent("1234;4321;3333;1231")).toThrow();
    });

    test("leading and trailing whitespace should be trimmed", () => {
        expect(parseMapViewExtent("   1234,4321,3333,1231  ")).toEqual([1234,4321,3333,1231]);
    });

    test("whitespaces between coordinates should be removed", () => {
        expect(parseMapViewExtent("1234      ,4321,   3333  , 1231")).toEqual([1234,4321,3333,1231]);
    });

    test("whitespaces between coordinates should be removed and trimmed from both sides", () => {
        expect(parseMapViewExtent(" 1234      ,4321,   3333  , 1231    ")).toEqual([1234,4321,3333,1231]);
    });

    test("invalid coordinates which cannot be parsed as float should throw an error", () => {
        expect(() => parseMapViewExtent(" dd123;4,w43|21,333ß3,1@231")).toThrow();
    });
});

describe("tests for getCurrentMapExtent", () => {
  test("undefined Map should throw error", () => {
    lastGeomapPanelInstance.map = undefined;

    expect(() => getCurrentMapExtent()).toThrow();
  });

  test("null Map should throw error", () => {
    lastGeomapPanelInstance.map = null;

    expect(() => getCurrentMapExtent()).toThrow();
  });

  test("null Map should throw error", () => {
    lastGeomapPanelInstance.map = null;

    expect(() => getCurrentMapExtent()).toThrow();
  });
});

describe("test editor", () => {
  test("initial entry in edit mode should leave the input field empty", async () => {
    render(<ExtentMapViewEditor value={{id: ""}} onChange={() => {}} />);
    expect(screen.getByTestId('map view editor extent map view editor input')).toHaveValue('');
  });

  test("entry in edit mode with mapViewExtent should set the input field to provided value", async () => {
    render(<ExtentMapViewEditor value={{id: "", mapViewExtent: [1,2,3,4]}} onChange={() => {}} />);
    expect(screen.getByTestId('map view editor extent map view editor input')).toHaveValue('1,2,3,4');
  });

  test("clearing the input and typing a new value should update input field with new value", async () => {
    render(<ExtentMapViewEditor value={{id: "", mapViewExtent: [1,2,3,4]}} onChange={(e) => {}} />);
    const input: HTMLInputElement = screen.getByTestId('map view editor extent map view editor input');
    await userEvent.click(input);
    // input.value = "";
    // await userEvent.clear(input);
    await userEvent.clear(input);
    // fireEvent(input, new Event("change"));
    await userEvent.type(input, "4,3,2,1");
    expect(input).toHaveValue("4,3,2,1");
  });

  // test('clear', async () => {
  //   const user = userEvent.setup()

  //   render(<textarea defaultValue="Hello, World!" />)

  //   await user.clear(screen.getByRole('textbox'))

  //   expect(screen.getByRole('textbox')).toHaveValue('')
  // })
});

