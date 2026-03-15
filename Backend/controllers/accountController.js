import supabase from "../config/supabaseClient.js";

export const getBalance = async (req, res) => {

  const userId = req.user.id;

  const { data } = await supabase
    .from("users")
    .select("balance")
    .eq("id", userId)
    .single();

  res.json({ balance: data.balance });
};


export const transferMoney = async (req, res) => {

  const senderId = req.user.id;
  const { receiver, amount } = req.body;

  const { data: sender } = await supabase
    .from("users")
    .select("*")
    .eq("id", senderId)
    .single();

  if (sender.balance < amount) {
    return res.json({ message: "Insufficient balance" });
  }

  const { data: receiverUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", receiver)
    .single();

  await supabase
    .from("users")
    .update({ balance: sender.balance - amount })
    .eq("id", senderId);

  await supabase
    .from("users")
    .update({ balance: receiverUser.balance + Number(amount) })
    .eq("id", receiverUser.id);

  await supabase.from("transactions").insert([
    {
      sender_id: senderId,
      receiver_id: receiverUser.id,
      amount,
      type: "transfer"
    }
  ]);

  res.json({ message: "Transfer successful" });
};


export const getStatement = async (req, res) => {

  const userId = req.user.id;

  const { data } = await supabase
    .from("transactions")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

  res.json(data);
};