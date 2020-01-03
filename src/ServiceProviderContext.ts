import * as React from 'react';
import { IServiceProvider } from 'inject-typesafe';

/**
 * React context for used by useServices and withServiceProps or for your own access to a configured IServiceProvider.
 */
export const ServiceProviderContext = React.createContext<IServiceProvider | undefined>(undefined);
