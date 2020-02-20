// @noflow
import * as jestMock from 'jest-mock';
import {createContext, runInNewContext} from 'vm';

export function mock(thing) {
  const mockContext = createContext();
  const mockGlobals = runInNewContext('this', mockContext);
  const moduleMocker = new jestMock.ModuleMocker(mockGlobals);
  const myMock = moduleMocker.generateFromMetadata(
    moduleMocker.getMetadata(thing)
  );
  return myMock;
}
