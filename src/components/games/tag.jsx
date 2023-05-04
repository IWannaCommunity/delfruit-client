export default function Tag({ name }) {
    return (
        <div className="box-border flex flex-row justify-center items-center px-2 gap-2.5 border rounded-[20px] bg-[#F9F9F9] border-[#232123] h-[24px] border-solid cursor-pointer group transition ease-linear delay-100 hover:invert">
            <span className="order-none grow-0 font-normal not-italic font-['Prompt'] text-base items-end text-center capitalize">
                {name}
            </span>
        </div>
    );
}
