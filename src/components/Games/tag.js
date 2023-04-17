export default function Tag({ name }) {
    return (
        <div className="box-border flex flex-row justify-center items-center px-2 border-[1px] rounded-[20px] bg-[#F9F9F9] border-[#232123] h-[24px] cursor-pointer hover:bg-[#FFFFCC] group gap-3">{name}</div>
    );
}
