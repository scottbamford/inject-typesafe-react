import * as React from 'react';
import { IServiceProvider } from 'inject-typesafe';

/**
 * React context for used by useInjected and withInjectedProps or for your own access to a configured IServiceProvider.
 */
export const InjectContext = React.createContext<IServiceProvider | undefined>(undefined);
