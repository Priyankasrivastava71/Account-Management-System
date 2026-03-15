import supabase from "../config/supabaseClient.js";

export const getBalance = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("users")
    .select("balance")
    .eq("id", userId)
    .single();

  if (error) {
    return res.status(400).json(error);
  }

  res.json({ balance: data.balance });
};


export const getUsers = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("users")
    .select("id,name,email")
    .neq("id", userId);

  if (error) {
    return res.status(400).json(error);
  }

  res.json(data);
};


export const transferMoney = async (req, res) => {

  const senderId = req.user.id;
  const { receiver, amount } = req.body;

  const sendAmount = Number(amount);

  const { data: sender } = await supabase
    .from("users")
    .select("*")
    .eq("id", senderId)
    .single();

  if (sender.balance < sendAmount) {
    return res.json({ message: "Insufficient balance" });
  }

  const { data: receiverUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", receiver)
    .single();

  if (!receiverUser) {
    return res.json({ message: "Receiver not found" });
  }

  await supabase
    .from("users")
    .update({ balance: sender.balance - sendAmount })
    .eq("id", senderId);

  await supabase
    .from("users")
    .update({ balance: receiverUser.balance + sendAmount })
    .eq("id", receiverUser.id);

  await supabase.from("transactions").insert([
    {
      sender_id: senderId,
      receiver_id: receiverUser.id,
      amount: sendAmount,
      type: "debit"
    },
    {
      sender_id: senderId,
      receiver_id: receiverUser.id,
      amount: sendAmount,
      type: "credit"
    }
  ]);

  res.json({ message: "Transfer successful" });
};


export const getStatement = async (req, res) => {

  const userId = req.user.id;

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

  if (error) {
    return res.status(400).json(error);
  }

  res.json(data);
};