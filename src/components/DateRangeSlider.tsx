import React, { useState, useEffect } from "react";
import { Configure } from "react-instantsearch";
import Slider from "@mui/material/Slider";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

type CombinedDateRangeSliderProps = {
  minTimestamp: number;
  maxTimestamp: number;
  dateFields: string[];
  title: string;
  onDateChange?: (isActive: boolean) => void;

  value?: { min: number; max: number }; // externally controlled value
  onChange?: (newValue: { min: number; max: number }) => void; // external change handler
};

const DateRangeSlider: React.FC<CombinedDateRangeSliderProps> = ({
  minTimestamp,
  maxTimestamp,
  dateFields,
  title,
  onDateChange,
  value,
  onChange,
}) => {
  const isControlled = value !== undefined;
  const [internalRange, setInternalRange] = useState<[number, number]>([
    minTimestamp,
    maxTimestamp,
  ]);
  const range = isControlled ? [value!.min, value!.max] : internalRange;

  const [filterString, setFilterString] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(
    dayjs(range[0] * 1000).format("YYYY"),
  );
  const [endDate, setEndDate] = useState<string>(
    dayjs(range[1] * 1000).format("YYYY"),
  );

  const updateRange = (newRange: [number, number]) => {
    if (!isControlled) setInternalRange(newRange);
    onChange?.({ min: newRange[0], max: newRange[1] });
    setStartDate(dayjs(newRange[0] * 1000).format("YYYY"));
    setEndDate(dayjs(newRange[1] * 1000).format("YYYY"));
  };

  // inside useEffect
  useEffect(() => {
    const isActive = range[0] !== minTimestamp || range[1] !== maxTimestamp;
    onDateChange?.(isActive);

    if (isActive) {
      // only set filter when range is active
      const singleCondition = `${dateFields[0]} >= ${range[0]} AND ${dateFields[0]} <= ${range[1]}`;
      setFilterString(singleCondition);
    } else {
      // no filter = include undated items too
      setFilterString("");
    }

    const updateURL = setTimeout(() => {
      const url = new URL(window.location.href);
      range[0] !== minTimestamp
        ? url.searchParams.set("start", dayjs(range[0] * 1000).format("YYYY"))
        : url.searchParams.delete("start");
      range[1] !== maxTimestamp
        ? url.searchParams.set("end", dayjs(range[1] * 1000).format("YYYY"))
        : url.searchParams.delete("end");
      window.history.replaceState(null, "", url.toString());
    }, 500);

    return () => clearTimeout(updateURL);
  }, [range, minTimestamp, maxTimestamp, dateFields]);
  useEffect(() => {
    if (value) {
      setStartDate(dayjs(value.min * 1000).format("YYYY"));
      setEndDate(dayjs(value.max * 1000).format("YYYY"));
    }
  }, [value]);
  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      updateRange([newValue[0], newValue[1]]);
    }
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setStartDate(value);
    const year = parseInt(value, 10);
    if (!isNaN(year)) {
      const newStart = dayjs().year(year).startOf("year").unix();
      if (newStart >= minTimestamp && newStart <= range[1]) {
        updateRange([newStart, range[1]]);
      }
    }
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEndDate(value);
    const year = parseInt(value, 10);
    if (!isNaN(year)) {
      const newEnd = dayjs().year(year).endOf("year").unix();
      if (newEnd <= maxTimestamp && newEnd >= range[0]) {
        updateRange([range[0], newEnd]);
      }
    }
  };

  return (
<>
  <Disclosure defaultOpen={true}>
        {({ open }) => (
          <div>
            <DisclosurePanel className="pt-3 px-4">
              <Slider
                getAriaLabel={(index) => `Date range slider thumb ${index + 1}`}
                value={range}
                min={minTimestamp}
                max={maxTimestamp}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => dayjs(value * 1000).format("YYYY")}
                marks={[
                  {
                    value: minTimestamp,
                    label: dayjs(minTimestamp * 1000).format("YYYY"),
                  },
                  {
                    value: maxTimestamp,
                    label: dayjs(maxTimestamp * 1000).format("YYYY"),
                  },
                ]}
                sx={{
                  width: "100%",
                  color: "#2e2323",
                  fontFamily:
                    "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif", // same as Tailwind's font-serif
                  "& .MuiSlider-thumb": { height: 24, width: 24 },
                  "& .MuiSlider-markLabel": {
                    fontFamily:
                      "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
                    fontSize: "0.875rem",
                  },
                  "& .MuiSlider-valueLabel": {
                    fontFamily:
                      "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
                  },
                }}
              />

              <div className="flex justify-between space-x-4 mt-4">
                <TextField
                  aria-label="Start date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  label="Start Year"
                  variant="outlined"
                  InputProps={{
                    sx: {
                      fontFamily:
                        "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontFamily:
                        "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
                    },
                  }}
                />
                <TextField
                  aria-label="End date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  label="End Year"
                  variant="outlined"
                  InputProps={{
                    sx: {
                      fontFamily:
                        "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontFamily:
                        "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
                    },
                  }}
                />
              </div>

              {/* Always render Configure, but only apply filters if active */}
              {filterString ? (
                <Configure filters={filterString} />
              ) : (
                <Configure />
              )}
            </DisclosurePanel>
          </div>
        )}
      </Disclosure>
 </>
  );
};

export default DateRangeSlider;
