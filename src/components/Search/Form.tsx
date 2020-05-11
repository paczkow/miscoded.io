/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, FormEvent, useEffect } from "react";
import { useQueryParams, StringParam } from "use-query-params";
import { useIntl } from "react-intl";

import { Stack, Inline } from "../foundations";
import { Button } from "../Button";
import { search } from "../../utils/search";

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
  const intl = useIntl();
  const [{ q: query, t: queryType }, setQuery] = useQueryParams({
    q: StringParam,
    t: StringParam,
  });
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
    setQuery({
      q: newValue,
      t: groupType,
    });
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
          setQuery({
            q: e.currentTarget.value,
            t: undefined,
          });
          setSearchValue(e.currentTarget.value);
        }}
        placeholder={intl.formatMessage({ id: "search.placeholder" })}
      />
      <Group
        groupName={intl.formatMessage({ id: "search.categories" })}
        items={categories}
        itemsType="category"
        query={query ?? ""}
        queryType={queryType}
        onClick={getHandleSelectGroupItem("category")}
      />
      <Group
        groupName={intl.formatMessage({ id: "search.tags" })}
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
