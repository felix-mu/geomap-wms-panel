import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import { ExtentMapViewEditor, parseMapViewExtent } from './ExtentMapViewEditor';
import React from 'react';

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

// test("", async () => {
//      // ARRANGE
//   render(<ExtentMapViewEditor value={{id: ""}} onChange={() => {}} />);
// });
