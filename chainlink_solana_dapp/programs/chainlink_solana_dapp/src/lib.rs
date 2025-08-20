use anchor_lang::{prelude::*, solana_program::system_program};
use chainlink_solana as chainlink;

declare_id!("CbF57SNy2UeDCbv2wNVrriEBWDRWTXRDSBECxEkmhUPG");

#[program]
pub mod chainlink_solana_dapp {
    use super::*;

    pub fn execute(ctx: Context<Execute>) -> Result<()> {
        let round = chainlink::latest_round_data(
            ctx.accounts.chainlink_program.to_account_info(),
            ctx.accounts.chainlink_feed.to_account_info(),
        )?;

        let result_account = &mut ctx.accounts.result_account;
        result_account.value = round.answer;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Execute<'info> {
    #[account(init, payer = user, space = 100)]
    pub result_account: Account<'info, ResultAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(address = system_program::ID)]
    /// CHECK: We're passing this account as a PDA
    pub system_program: AccountInfo<'info>,

    /// CHECK: This is the Chainlink program library
    pub chainlink_program: AccountInfo<'info>,
    /// CHECK: We're reading data from this specified chainlink feed
    pub chainlink_feed: AccountInfo<'info>,
}

#[account]
pub struct ResultAccount {
    pub value: i128,
}
