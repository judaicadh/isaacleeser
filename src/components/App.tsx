import React from 'react';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';
import { motion } from 'framer-motion';

const searchClient = algoliasearch('ZLPYTBTZ4R', 'be46d26dfdb299f9bee9146b63c99c77');

export default function App() {
  return (
      <>
        {/* Hero Section */}
        <motion.section
            className="bg-gradient-to-b from-muted/30 to-background py-16"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl mb-4 text-foreground font-semibold">
                Preserving the Correspondence of Isaac Leeser
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Explore the extensive correspondence and writings
                of Rev. Isaac Leeser (1806-1868), pioneering
                American Jewish educator, publisher, and religious
                leader. This collection contains over 2,000
                digitized letters, manuscripts, and documents that
                illuminate nineteenth-century American Jewish life.
              </p>

              {/* Search Bar */}
              <div className="flex gap-2 max-w-lg mx-auto mb-8">
                <div className="relative flex-1">
                  <InstantSearch indexName="dev_Leeser" searchClient={searchClient}>
                    <SearchBox
                        classNames={{
                          root: "max-w-md mx-auto",
                          form: "relative",
                          input:
                              "block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-accent focus:border-accent focus:outline-none transition",
                          submit:
                              "absolute right-2.5 bottom-2.5 bg-accent hover:bg-accent/80 focus:ring-4 focus:outline-none focus:ring-accent/40 font-medium rounded-lg text-sm px-4 py-2 text-white transition",
                          submitIcon:
                              "w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none",
                        }}
                        placeholder="Search Letters, Dates, People, and Places..."
                        translations={{ submitTitle: "Search" }}
                        aria-label="Search the Leeser collection"
                    />
                    {/* Optionally style Hits or custom result cards */}
                    {/* <Hits /> */}
                  </InstantSearch>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Partners Section */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <h4 className="text-xl text-gray-400 text-center font-medium">Project Partners</h4>
            </div>
            <div className="grid grid-cols-2 justify-center items-center gap-12 md:grid-cols- xl:grid-cols-none xl:flex xl:justify-between">
              {/* Example SVG logo */}

              {/* ... repeat or replace with actual SVG content as needed ... */}
              {/* Example image logo */}
              <a href="#" className="flex justify-center items-center" aria-label="American Jewish Historical Society">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/1/11/AJHS_logo_horizontal.png"
                    alt="American Jewish Historical Society Logo"
                    className="h-12 object-containtransition"
                    loading="lazy"
                />
              </a>
              <a href="#" className="flex justify-center items-center" aria-label="University of Southampton">
                <img
                    src= "https://upload.wikimedia.org/wikipedia/en/thumb/3/32/University_of_Southampton_Logo.png/960px-University_of_Southampton_Logo.png"
                    alt="University of Southampton Logo"
                    className="h-12 object-containtransition"
                    loading="lazy"
                />
              </a>
              <a href="#" className="flex justify-center items-center" aria-label="Kislak Center for Special Collections">
                <img
                    src= "https://therevolutionarycity.org/sites/default/files/inline-images/penn.png"
                    alt="Kislak Center for Special Collections Logo"
                    className="h-12 object-containtransition"
                    loading="lazy"
                />
              </a>
              <a href="#" className="flex justify-center items-center" aria-label="American Jewish Archivesy">
                <img
                    src= "https://www.americanjewisharchives.org/wp-content/uploads/AJA-HUC-JIR2-scaled.jpg"
                    alt="American Jewish Archives"
                    className="h-12 object-containtransition"
                    loading="lazy"
                />
              </a>
              <a href="#" className="flex justify-center items-center" aria-label="Jewish Theological Seminary">
              <img
                  src= "https://upload.wikimedia.org/wikipedia/en/9/9d/Jewish_Theological_Seminary_of_America_logo_with_name.svg"
                  alt="Jewish Theological Seminary Logo"
                  className="h-12 object-containtransition"
                  loading="lazy"
              />
            </a>


            </div>
          </div>
        </section>
      </>
  );
}


