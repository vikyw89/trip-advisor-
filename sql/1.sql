

CREATE or REPLACE FUNCTION create_new_public_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
as $$
BEGIN
  INSERT into public."User"(id)
  VALUES (new.id);
  RETURN new;
END;
$$;


CREATE or REPLACE TRIGGER create_new_public_user_trigger
AFTER INSERT on auth."users"
FOR EACH ROW
EXECUTE FUNCTION create_new_public_user();

-- to trigger deletion of user when someone deleted their account on auth users


CREATE or REPLACE FUNCTION delete_public_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
as $$
BEGIN
  DELETE
  FROM public."User"
  WHERE id LIKE old.id::text;
  RETURN old;
END;
$$;


CREATE or REPLACE TRIGGER delete_public_user_trigger
AFTER DELETE on auth."users"
FOR EACH ROW
EXECUTE FUNCTION delete_public_user();