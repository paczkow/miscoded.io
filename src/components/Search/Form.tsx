/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, FormEvent, useEffect } from "react";
import { useQueryParam, StringParam } from "use-query-params";

import { search } from "../../utils/search";
import { Button } from "../Button";
import { Stack } from "../Layout/Stack";
import { Inline } from "../Layout/Inline";

interface FormProps {
  categories: { fieldValue: string }[];
  tags: { fieldValue: string }[];
  onChange: (ids: string[] | null) => void;
  elasticLunrSearchIndex: any;
}

export const Form: React.FC<FormProps> = ({
  categories,
  tags,
  onChange,
  elasticLunrSearchIndex,
}) => {
  const [query, setQuery] = useQueryParam("q", StringParam);
  const [queryType, setQueryType] = useQueryParam("t", StringParam);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchValue] = useState(query ?? "");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    isDirty &&
      onChange(search(query ?? "", queryType ?? "", elasticLunrSearchIndex));
  }, [query, queryType]);

  const getHandleSelectGroupItem = (groupType: string) => (
    newValue: string
  ) => {
    setIsDirty(true);
    setQuery(newValue);
    setQueryType(groupType);
    setSearchValue(newValue);
  };

  return (
    <Stack space="medium" align="center">
      <input
        css={{
          width: 200,
          background: "transparent",
          border: 0,
          borderBottom: "1px solid #ffffff",
          padding: 8,
          fontSize: 16,
          color: "#ffffff",
        }}
        value={query ?? ""}
        onChange={(e: FormEvent<HTMLInputElement>) => {
          setIsDirty(true);
          setQuery(e.currentTarget.value);
          setQueryType(undefined);
          setSearchValue(e.currentTarget.value);
        }}
        placeholder="Wyszukaj"
      />
      <Group
        groupName="Kategorie"
        items={categories}
        searchValue={query ?? ""}
        onClick={getHandleSelectGroupItem("category")}
      />
      <Group
        groupName="Tagi"
        items={tags}
        searchValue={query ?? ""}
        onClick={getHandleSelectGroupItem("tag")}
      />
    </Stack>
  );
};

interface GroupProps {
  groupName: string;
  items: { fieldValue: string }[];
  searchValue: string;
  onClick: (newValue: string) => void;
}

const Group: React.FC<GroupProps> = ({
  groupName,
  items,
  onClick,
  searchValue,
}) => (
  <Stack space="small" align="center">
    <h4 css={{ color: "#ffffff" }}>{groupName}</h4>
    <Inline space="small">
      {items.map(groupItem => {
        const isSelected = groupItem.fieldValue === searchValue;
        return (
          <Button
            key={groupItem.fieldValue}
            onClick={() => onClick(groupItem.fieldValue)}
            isSelected={isSelected}
          >
            <span>{groupItem.fieldValue}</span>
          </Button>
        );
      })}
    </Inline>
  </Stack>
);
