import { useState, forwardRef } from "react";
import { Checkbox, CircularProgress } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";
import { Item as ItemType } from "@/types/models";
import { addListItem, removeListItem } from "@/util/api";

export type ItemProps = {
  listId: number;
  item: ItemType;
  selected: boolean;
  onDelete?: (id: number) => any;
  listeners?: any;
  style?: {
    transform: string | undefined;
    transition: string | undefined;
  };
};

export default forwardRef(function Item(
  { item, listId, selected, onDelete, style, listeners, ...props }: ItemProps,
  ref: any
) {
  const [checked, setChecked] = useState(selected);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div
      ref={ref}
      className="item"
      style={{ display: "flex", justifyContent: "space-between", ...style }}
      {...props}
    >
      <div>
        <Checkbox
          checked={checked}
          onChange={handleChange}
          sx={{ padding: "5px" }}
        />
        &nbsp;
        <div
          className="item-name"
          style={{
            cursor: item.isOptimistic ? "default" : "grab",
            touchAction: "none",
          }}
          {...listeners}
        >
          {item.name}
        </div>
      </div>
      <div
        className="item-delete"
        style={{ display: "inline-block", verticalAlign: "middle" }}
      >
        {(item.isOptimistic || isDeleting) && (
          <CircularProgress
            size="1.5rem"
            sx={{ position: "relative", top: "7px" }}
          />
        )}
        {!item.isOptimistic && !isDeleting && onDelete && (
          <DeleteForever
            className="item-delete-button"
            sx={{ color: "grey", position: "relative", top: 5 }}
            onClick={handleDelete}
          />
        )}
      </div>
    </div>
  );

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const data = { listId, itemId: item.id };
    const { checked } = event.target;
    checked ? addListItem(data) : removeListItem(data);
    setChecked(checked);
  }

  async function handleDelete() {
    setIsDeleting(true);
    onDelete ? onDelete(item.id) : null;
    setIsDeleting(false);
  }
});
