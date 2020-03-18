/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, FormEvent, useEffect } from "react";
import { useQueryParam, StringParam } from "use-query-params";

import { search } from "../../utils/search";
import { Button } from "../Button";
import { Stack } from "../foundations/layout/Stack";
import { Inline } from "../foundations/layout/Inline";

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
    setSearchValue(`${newValue}${groupType}`);
  };

  return (
    <Stack space="medium" align="center">
      <input
        css={{
          width: 200,
          background: "transparent",
          border: 0,
          borderRadius: 0,
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
        itemsType="category"
        query={query ?? ""}
        queryType={queryType}
        onClick={getHandleSelectGroupItem("category")}
      />
      <Group
        groupName="Tagi"
        itemsType="tag"
        items={tags}
        query={query ?? ""}
        queryType={queryType}
        onClick={getHandleSelectGroupItem("tag")}
      />
    </Stack>
  );
};

interface GroupProps {
  groupName: string;
  items: { fieldValue: string }[];
  itemsType: string;
  query: string;
  queryType: string | undefined;
  onClick: (newValue: string) => void;
}

const Group: React.FC<GroupProps> = ({
  groupName,
  items,
  onClick,
  query,
  queryType,
  itemsType,
}) => (
  <Stack space="small" align="center">
    <h4 css={{ color: "#ffffff" }}>{groupName}</h4>
    <Inline space="small" align="center">
      {items.map(groupItem => {
        const isSelected =
          groupItem.fieldValue === query && queryType == itemsType;

        return (
          <Button
            key={groupItem.fieldValue}
            onClick={() => onClick(groupItem.fieldValue)}
            isSelected={isSelected}
          >
            <span>
              {itemsType === "tag" ? "#" : ""}
              {groupItem.fieldValue}
            </span>
          </Button>
        );
      })}
    </Inline>
  </Stack>
);
