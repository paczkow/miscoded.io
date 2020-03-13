import React, { useState, FormEvent } from "react";
import { Button } from "../Button";
import { Stack } from "../layout/Stack";
import { Inline } from "../layout/Inline";

interface FormProps {
  categories: { fieldValue: string }[];
  tags: { fieldValue: string }[];
}

export const Form: React.FC<FormProps> = ({ categories, tags }) => {
  const [searchValue, setSearchValue] = useState("");

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
        value={searchValue}
        onChange={(e: FormEvent<HTMLInputElement>) =>
          setSearchValue(e.currentTarget.value)
        }
        placeholder="Wyszukaj"
      />
      <Group
        groupName="Kategorie"
        items={categories}
        searchValue={searchValue}
        onClick={(newValue: string) => setSearchValue(newValue)}
      />
      <Group
        groupName="Tagi"
        items={tags}
        searchValue={searchValue}
        onClick={(newValue: string) => setSearchValue(newValue)}
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
