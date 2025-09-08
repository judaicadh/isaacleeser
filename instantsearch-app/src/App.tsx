import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  Configure,
  DynamicWidgets,
  Hits,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
} from 'react-instantsearch';

import { Panel } from './Panel';

import type { Hit } from 'instantsearch.js';

import './App.css';

const searchClient = algoliasearch(
  'ZLPYTBTZ4R',
  'be46d26dfdb299f9bee9146b63c99c77'
);

const future = { preserveSharedStateOnUnmount: true };

export function App() {
  return (
    <div>
      <header className="header">
        <h1 className="header-title">
          <a href="/">instantsearch-app</a>
        </h1>
        <p className="header-subtitle">
          using{' '}
          <a href="https://github.com/algolia/instantsearch/tree/master/packages/react-instantsearch">
            React InstantSearch
          </a>
        </p>
      </header>

      <div className="container">
        <InstantSearch
          searchClient={searchClient}
          indexName="dev_Leeser"
          future={future}
          insights
        >
          <Configure hitsPerPage={8} />
          <div className="search-panel">
            <div className="search-panel__filters">
              <DynamicWidgets fallbackComponent={RefinementList}>
                <Panel header="type">
                  <RefinementList attribute="type" />
                </Panel>
                <Panel header="Subjects">
                  <RefinementList attribute="Subjects" />
                </Panel>
                <Panel header="creators">
                  <RefinementList attribute="creators" />
                </Panel>
                <Panel header="collection">
                  <RefinementList attribute="collection" />
                </Panel>
                <Panel header="toLocation">
                  <RefinementList attribute="toLocation" />
                </Panel>
                <Panel header="fromLocation">
                  <RefinementList attribute="fromLocation" />
                </Panel>
              </DynamicWidgets>
            </div>

            <div className="search-panel__results">
              <SearchBox placeholder="" className="searchbox" />
              <Hits hitComponent={Hit} />

              <div className="pagination">
                <Pagination />
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}

type HitProps = {
  hit: Hit;
};

function Hit({ hit }: HitProps) {
  return (
    <article>
      <p>
        <code>{JSON.stringify(hit).slice(0, 100)}...</code>
      </p>
    </article>
  );
}
