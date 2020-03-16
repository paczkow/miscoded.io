/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, FormEvent, useEffect } from "react";
import { useQueryParam, StringParam } from "use-query-params";
import { Index } from "elasticlunr";

import { Button } from "../Button";
import { Stack } from "../Layout/Stack";
import { Inline } from "../Layout/Inline";

interface FormProps {
  categories: { fieldValue: string }[];
  tags: { fieldValue: string }[];
  onChange: (ids: string[] | null) => void;
  elasticLunrSearchIndex: any;
}

const toSearchConfig = (queryType: string | undefined) => {
  switch (queryType) {
    case undefined:
      return {
        expand: true,
      };
    case "category":
      return {
        fields: {
          categories: { boost: 2 },
        },
      };
    case "tag":
      return {
        fields: {
          tags: { boost: 2 },
        },
      };
    default:
      return {
        expand: true,
      };
  }
};

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

  let searchIndex: Index<any> | null = null;
  let searchConfig = {};

  useEffect(() => {
    searchConfig = toSearchConfig(queryType);
    search();
  }, [query, queryType]);

  const getHandleSelectGroupItem = (groupType: string) => (
    newValue: string
  ) => {
    setSearchValue(newValue);
    setQuery(newValue);
    setQueryType(groupType);
  };

  const getOrCreateSearchIndex = () =>
    searchIndex ? searchIndex : Index.load(elasticLunrSearchIndex.index);

  const search = () => {
    searchIndex = getOrCreateSearchIndex() as Index<any>;

    const ids = query
      ? searchIndex
          .search(query ?? "", searchConfig)
          .map(({ ref }) => searchIndex?.documentStore.getDoc(ref))
          .map(item => item.id)
      : null;

    onChange(ids);
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
          setSearchValue(e.currentTarget.value);
          setQuery(e.currentTarget.value);
          setQueryType(undefined);
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
            <span css={{ color: `${isSelected ? "#000000" : "#ffffff"}` }}>
              {groupItem.fieldValue}
            </span>
          </Button>
        );
      })}
    </Inline>
  </Stack>
);
